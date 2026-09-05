#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 1 || ! $1 =~ ^[0-9a-f]{40}$ ]]; then
    echo "usage: kakhki-release <40-character release sha>" >&2
    exit 2
fi

release="$1"
base_dir=/opt/kakhki.me
image_file="/tmp/developer-portfolio-${release}.tar.gz"
compose_file="/tmp/kakhki-compose-${release}.yml"
release_env="${base_dir}/release.env"
docker_bin=/usr/bin/docker

if [[ ! -f $image_file || ! -f $compose_file ]]; then
    echo "release files are missing" >&2
    exit 1
fi

cleanup() {
    rm -f -- "$image_file" "$compose_file"
}
trap cleanup EXIT

compose() {
    "$docker_bin" compose --env-file "$release_env" -f "${base_dir}/docker-compose.yml" "$@"
}

wait_for_healthy() {
    local state health attempt
    for attempt in $(seq 1 45); do
        state="$($docker_bin inspect --format '{{.State.Status}}' developer-portfolio 2>/dev/null || true)"
        health="$($docker_bin inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' developer-portfolio 2>/dev/null || true)"
        [[ $health == healthy ]] && return 0
        if [[ $state == exited || $state == dead ]]; then
            return 1
        fi
        sleep 2
    done
    return 1
}

previous_image="$($docker_bin inspect --format '{{.Config.Image}}' developer-portfolio 2>/dev/null || true)"
install -d -o root -g root -m 0755 "$base_dir"
install -o root -g root -m 0644 "$compose_file" "${base_dir}/docker-compose.yml"
"$docker_bin" load --input "$image_file"
printf 'PORTFOLIO_IMAGE=developer-portfolio:%s\n' "$release" > "$release_env"
chmod 600 "$release_env"
compose config --quiet
compose up -d --no-build --remove-orphans

if ! wait_for_healthy; then
    "$docker_bin" logs --tail 120 developer-portfolio >&2 || true
    if [[ -n $previous_image ]]; then
        printf 'PORTFOLIO_IMAGE=%s\n' "$previous_image" > "$release_env"
        compose up -d --no-build --remove-orphans
        wait_for_healthy || {
            "$docker_bin" logs --tail 120 developer-portfolio >&2 || true
            exit 1
        }
    fi
    exit 1
fi

compose ps
"$docker_bin" image prune -af --filter until=168h
