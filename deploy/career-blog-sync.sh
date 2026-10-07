#!/usr/bin/env bash
set -Eeuo pipefail

site_root=/srv/projects/career/kakhki-site
source_host=hermes@35.246.148.35
source_root=/srv/projects/career/kakhki-site
ssh_key=/root/.ssh/career-blog-sync
state_dir=/var/lib/career-blog-sync
state_file=$state_dir/revalidated.tsv
app_env=/etc/kakhki.me/app.env
webhook=http://127.0.0.1:3000/api/revalidate

install -d -m 0755 "$site_root/content/blogs" "$site_root/public/blog/og"
install -d -m 0700 "$state_dir"
exec {lock_fd}>"$state_dir/lock"
flock -n "$lock_fd" || exit 0

secret=$(sed -n 's/^REVALIDATE_SECRET=//p' "$app_env" | tail -n 1)
secret=${secret%\"}
secret=${secret#\"}
secret=${secret%\'}
secret=${secret#\'}
[[ -n $secret ]] || {
  echo 'REVALIDATE_SECRET is missing' >&2
  exit 1
}

ssh_command="ssh -p 22 -i $ssh_key -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes"
rsync -rtz --checksum --delete --delay-updates --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  -e "$ssh_command" "$source_host:$source_root/content/blogs/" "$site_root/content/blogs/"
rsync -rtz --checksum --delete --delay-updates --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r \
  -e "$ssh_command" "$source_host:$source_root/public/blog/og/" "$site_root/public/blog/og/"

declare -A previous=() current=()
if [[ -f $state_file ]]; then
  while IFS=$'\t' read -r slug hash; do
    [[ $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] && previous["$slug"]=$hash
  done < "$state_file"
fi
while IFS= read -r -d '' file; do
  slug=${file##*/}
  slug=${slug%.json}
  [[ $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || continue
  hash=$(sha256sum -- "$file")
  current["$slug"]=${hash%% *}
done < <(find "$site_root/content/blogs" -maxdepth 1 -type f -name '*.json' -print0)

failed=0
while IFS= read -r slug; do
  [[ -n $slug ]] || continue
  if [[ ${current[$slug]-} != "${previous[$slug]-}" ]]; then
    payload=$(jq -nc --arg secret "$secret" --arg slug "$slug" '{secret: $secret, slug: $slug}')
    if curl --noproxy '*' --fail-with-body -sS --max-time 10 \
      -H 'Content-Type: application/json' --data-binary "$payload" "$webhook" >/dev/null; then
      if [[ -v current[$slug] ]]; then previous["$slug"]=${current[$slug]}; else unset 'previous[$slug]'; fi
      echo "Revalidated blog slug: $slug"
    else
      failed=1
      echo "Could not revalidate blog slug: $slug" >&2
    fi
  fi
done < <(printf '%s\n' "${!current[@]}" "${!previous[@]}" | sort -u)

tmp_file=$(mktemp "$state_dir/revalidated.XXXXXX")
for slug in "${!previous[@]}"; do printf '%s\t%s\n' "$slug" "${previous[$slug]}"; done | sort > "$tmp_file"
mv "$tmp_file" "$state_file"
exit "$failed"
