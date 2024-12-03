import { AngularEditorConfig } from "@kolkov/angular-editor";

export class Helper {
    //configuration of angular Editor
    static editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'ادخل النص...',
        defaultParagraphSeparator: '',
        defaultFontName: 'Cairo, sans-serif',
        defaultFontSize: '',
        uploadUrl: '',
        uploadWithCredentials: false,
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [

                // 'customClasses',
                'insertVideo',
                'insertHorizontalRule',
                'toggleEditorMode',
                'fonts'

            ]
        ]
    };

    // Function to get a CSS rule by class name
    static getCSSRuleByClassName(className: string): CSSStyleRule | null {
        // Iterate over all stylesheets
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            let rules = (sheet as CSSStyleSheet).cssRules || (sheet as CSSStyleSheet).rules; // Handle browser differences

            if (rules) {
                // Iterate over all rules in the stylesheet
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j] as CSSStyleRule;

                    // Check if the rule's selector matches the class name
                    if (rule.selectorText === `.${className}`) {
                        return rule; // Return the matching rule
                    }
                }
            }
        }

        return null; // Return null if no matching rule is found
    }


    // Function to modify a CSS rule's property
    static modifyCSSRuleProperty(className: string, property: string, value: string) {
        const cssRule = this.getCSSRuleByClassName(className);

        if (cssRule) {
            cssRule.style[property as any] = value; // Update the property value
        }
    }

}
