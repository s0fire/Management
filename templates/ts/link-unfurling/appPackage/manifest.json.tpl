{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
    "manifestVersion": "1.16",
    "version": "1.0.0",
    "id": "${{TEAMS_APP_ID}}",
    "packageName": "com.microsoft.teams.extension",
    "developer": {
        "name": "Teams App, Inc.",
        "websiteUrl": "https://www.example.com",
        "privacyUrl": "https://www.example.com/privacy",
        "termsOfUseUrl": "https://www.example.com/termofuse"
    },
    "icons": {
        "color": "color.png",
        "outline": "outline.png"
    },
    "name": {
        "short": "{{appName}}${{APP_NAME_SUFFIX}}",
        "full": "full name for {{appName}}"
    },
    "description": {
        "short": "short description of {{appName}}",
        "full": "full description of {{appName}}"
    },
    "accentColor": "#FFFFFF",
    "bots": [],
    "composeExtensions": [
        {
            "botId": "${{BOT_ID}}",
            "commands": [
                {
                    "id": "searchQuery",
                    "context": [
                        "compose",
                        "commandBox"
                    ],
                    "description": "Test command to run query",
                    "title": "Search",
                    "type": "query",
                    "parameters": [
                        {
                            "name": "searchQuery",
                            "title": "Search Query",
                            "description": "Your search query",
                            "inputType": "text"
                        }
                    ]
                }
            ],
            "messageHandlers": [
                {
                    "type": "link",
                    "value": {
                        "domains": [
                            "*.botframework.com"
                        ],
                        "supportsAnonymizedPayloads": true
                    }
                }
            ]
        }
    ],
    "configurableTabs": [],
    "staticTabs": [],
    "permissions": [
        "identity",
        "messageTeamMembers"
    ],
    "validDomains": []
}