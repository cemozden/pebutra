import { YAMLConfigManager } from "../configmanagement/YAMLConfigManager";

export function LoginRoutes(app : any, systemLanguage : any) {

    app.get('/', (req, res) => {
        const configManager = new YAMLConfigManager();
        
        const availableLanguages = configManager.getAvailableLanguagesInfo();
        let optionOutput = '';
        
        availableLanguages.forEach((al) => {
            let selected = '';
            if (al.alias === configManager.getPebutraSettings().language) selected = 'selected';
            optionOutput = optionOutput + `<option value="${al.alias}" ${selected}>${al.fullName}</option>`;
        });
        
        res.render('login_adduser', { language : systemLanguage, 
                              languageOptions : optionOutput
                            });
    });

    app.get('/main', (req, res) => {
        res.send('Main Window');
    });

};