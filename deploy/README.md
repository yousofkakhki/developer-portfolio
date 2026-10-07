# GCP deployment

The production path builds on GitHub Actions and transfers an immutable Docker
image to the Debian VM. The VM does not build source code.

## GitHub configuration

The deploy job expects these repository or production-environment secrets:

- `DEPLOY_HOST`: `35.209.91.226`
- `DEPLOY_SSH_KEY`: a dedicated private key whose public half is authorized on the VM
- `DEPLOY_KNOWN_HOSTS`: the pinned `ssh-keyscan -H 35.209.91.226` output

The workflow connects as `blockchain_specialist_aut`; its public deployment
key is authorized for that account on the VM. The old `DEPLOY_USER` secret is
no longer used.

Public build-time values can be set as repository variables. They are optional
because the application has safe defaults:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GSC_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_GTM`
- `NEXT_PUBLIC_ENABLE_VRM_AVATAR`

Application secrets stay in `/etc/kakhki.me/app.env` on the VM and are never
stored in GitHub Actions artifacts.

## Career blog content

The career engine writes article JSON and OG images on devbots under
`/srv/projects/career/kakhki-site`. The websites VM reads those files into the
portfolio through read-only Compose mounts. Its `career-blog-sync.timer` pulls
the content once per minute with the root-only SSH key at
`/root/.ssh/career-blog-sync`, then calls the local revalidation endpoint with
`REVALIDATE_SECRET` from `/etc/kakhki.me/app.env`.

Install `deploy/career-blog-sync.sh` as
`/usr/local/sbin/career-blog-sync` and the accompanying service and timer in
`/etc/systemd/system`. The destination directories must exist before the
portfolio Compose release starts. The SSH public key is authorized for
`hermes` on devbots with forwarding and interactive sessions disabled.

## HTTPS activation

Point the `kakhki.me` and `www.kakhki.me` A records at `35.209.91.226`, then
issue the certificate from the VM with Certbot. The Nginx configuration already
serves the ACME challenge path.
