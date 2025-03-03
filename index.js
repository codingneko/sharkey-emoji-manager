const userAccount = JSON.parse(localStorage.getItem('account'));

document.addEventListener('DOMContentLoaded', () => {
    if (userAccount == null) {
        growl('error', 'You are not logged in!')
    } else if (userAccount.isAdmin || userAccount.roles.length > 0 && userAccount.roles[0].name == "Emoji curator") {
        const curatorStatusElement = document.getElementById('curator-status');
        curatorStatusElement.innerText = 'an emoji curator';
        curatorStatusElement.style = "color: #8afb80;";
    } else {
        growl("error", "You will not be able to create emojis because you\'re not an emoji curator.")
    }
});

document.getElementById('emojiForm').addEventListener('submit', (e) => {
    e.preventDefault();

    let emojiName = document.getElementById('name').value;
    let file = document.getElementById('file').files[0];

    let body = new FormData();
    body.append("i", userAccount.token);
    body.append("name", file.name)
    body.append("file", file);
    body.append("force", "true");

    fetch('https://catboy.baby/api/drive/files/create', {
        method: 'POST',
        body: body
    })
    .then(response => response.json())
    .then(file => {
        if (file.id != undefined) {
            console.log(`Adding emoji ${emojiName}, with file ID: ${file.id}`);
        
            let headers = new Headers();
            headers.set("Content-Type", "application/json")
    
            fetch('https://catboy.baby/api/admin/emoji/add', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(
                    {
                        name: emojiName,
                        fileId: file.id,
                        category: userAccount.username,
                        aliases: [],
                        license: '',
                        isSensitive: false,
                        localOnly: false,
                        roleIdsThatCanBeUsedThisEmojiAsReaction: [],
                        i: userAccount.token
                    }
                )
            })
            .then(response => response.json())
            .then(emoji => {
                if (emoji.id != undefined) {
                    growl("success", `Your emoji was created. Note it may take a little for it to be displayed. 
                        You can see the details of your new emoji below:
                     ${JSON.stringify(emoji)}`)
                } else {
                    growl("error", `Your emoji could not be created, find more information below:
                        ${JSON.stringify(emoji)}`)
                }
                
            });
        } else {
            growl('error', `Your file couldn't be uploaded, find more info below:
                ${JSON.stringify(emoji)}`)
        }
    });
});

function growl(type, message) {
    const resultContainer = document.getElementById('result');
    resultContainer.classList = [type];
    resultContainer.innerText = message;
}