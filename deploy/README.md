# GCP deployment

The production path builds on GitHub Actions and transfers an immutable Docker
image to the Debian VM. The VM does not build source code.

## GitHub configuration

The deploy job expects these repository or production-environment secrets:

- `DEPLOY_HOST`: `35.209.91.226`
- `DEPLOY_USER`: `blockchain.specialist.aut`
- `DEPLOY_SSH_KEY`: a dedicated private key whose public half is authorized on the VM
- `DEPLOY_KNOWN_HOSTS`: the pinned `ssh-keyscan -H 35.209.91.226` output

Public build-time values can be set as repository variables. They are optional
because the application has safe defaults:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GSC_VERIFICATION`
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`
- `NEXT_PUBLIC_GTM`
- `NEXT_PUBLIC_ENABLE_VRM_AVATAR`

Application secrets stay in `/etc/kakhki.me/app.env` on the VM and are never
stored in GitHub Actions artifacts.

## HTTPS activation

Point the `kakhki.me` and `www.kakhki.me` A records at `35.209.91.226`, then
issue the certificate from the VM with Certbot. The Nginx configuration already
serves the ACME challenge path.
