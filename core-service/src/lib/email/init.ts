
import {MailJetProvider} from '../../pkg/email/MailJetProvider.js';
import {env} from '../config/env.js';

export const mailProvider:MailJetProvider = new MailJetProvider(
    env.emailProvider.apiKey,
    env.emailProvider.apiSecret,
    env.emailProvider.fromEmail,
    env.emailProvider.fromName,
)