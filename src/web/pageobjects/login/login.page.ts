import { BasePage } from "../base.page.ts";

/**
 * Login page class - template example for page object pattern.
 * Replace selectors and methods with actual application elements.
 */
export class LoginPage extends BasePage {
    /**
     * Login form input locators - template selectors, update for your application
     */
    inputs = {
        email: this.page.getByTestId('qa-input-email'),
        password: this.page.getByTestId('qa-input-password'),
    };

    /**
     * Login form button locators - template selectors, update for your application
     */
    buttons = {
        login: this.page.getByTestId('qa-btn-login'),
        forgotPassword: this.page.getByTestId('qa-btn-forgot-password'),
        signUp: this.page.getByTestId('qa-btn-signup'),
        showPassword: this.page.getByTestId('qa-btn-show-password'),
    };

    /**
     * Login form message locators - template selectors, update for your application
     */
    messages = {
        errorMessage: this.page.getByTestId('qa-error-message'),
        successMessage: this.page.getByTestId('qa-success-message'),
        validationError: this.page.getByTestId('qa-validation-error'),
    };
}
