# Emoji management pannel for Sharkey
This simple HTML page is able to handle uploading of emojis for users having the `can manage custom emojis` permission, who aren't administrator and therefore cannot access the Control Panel to manage emoticons from there.

## Installation
To install this script you need to point your reverse proxy to it and serve it from a subdirectory of the domain where your Sharkey installatio is served from.
For example:
If your domain is catboy.baby, it needs to be served under https://catboy.baby/emoji-manager (or any other route as long as it's under the catboy.baby domain).

Example configuration (for Nginx): 

```
location /emoji-manager {
    root /var/www/catboy;
	index index.html;
}
```