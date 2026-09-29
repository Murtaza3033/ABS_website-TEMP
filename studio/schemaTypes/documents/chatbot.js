import {defineField, defineType} from 'sanity'

/* Chat assistant (the blue chat bubble on every page) — singleton, fixed _id
   "chatbot". Its own document rather than a Site Settings group: ~25 texts
   that only make sense together, edited by whoever looks after the bot, and
   kept out of the site-wide contact/identity settings. The questions and
   answers it offers are the "FAQ" documents; its emails and phone numbers
   come from Site Settings → Departments. The conversation flow, lead capture
   and validation stay in code. Empty fields use the built-in text.

   Placeholders: {name} = the visitor's name, {product} = the product they
   picked, {email} = the careers email. */

const fs = [
  {name: 'widget', title: 'Chat window', options: {collapsible: true, collapsed: false}},
  {name: 'menu', title: 'Main menu buttons', options: {collapsible: true, collapsed: true}},
  {name: 'replies', title: 'Bot replies', options: {collapsible: true, collapsed: true}},
  {name: 'closing', title: 'After a demo / partnership request', options: {collapsible: true, collapsed: true}},
]

const ls = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeString', fieldset, description})
const lt = (name, title, fieldset, description) =>
  defineField({name, title, type: 'localeText', fieldset, description})

export default defineType({
  name: 'chatbot',
  title: 'Chat assistant',
  type: 'document',
  fieldsets: fs,
  fields: [
    ls('name', 'Assistant name', 'widget', 'e.g. "Align Assistant"'),
    ls('status', 'Status line', 'widget', 'e.g. "Online now"'),
    ls('tip', 'Nudge bubble', 'widget', 'Shown next to the chat button after a few seconds.'),
    ls('placeholder', 'Message box placeholder', 'widget'),
    lt('greeting', 'Greeting', 'widget', 'The first message when the chat opens.'),

    ls('menuDemo', '"Book a demo"', 'menu', 'Starts the demo request.'),
    ls('menuProducts', '"Learn about products"', 'menu'),
    ls('menuQuestion', '"Ask a question"', 'menu', 'Shows the FAQ questions.'),
    ls('menuPartnership', '"Partnership"', 'menu', 'Starts the partnership request.'),
    ls('menuCareers', '"Careers"', 'menu'),
    ls('menuHuman', '"Talk to a human"', 'menu', 'Shows the contact options.'),
    ls('backToMenu', '"Back to menu"', 'menu'),

    ls('faqIntro', 'Before the FAQ questions', 'replies', 'e.g. "Sure — tap a question:"'),
    ls('faqHelpful', 'After an answer — "helpful" button', 'replies', 'e.g. "Yes, thanks"'),
    ls('faqThanks', 'Reply to the "helpful" button', 'replies'),
    ls('menuAgain', 'Menu shown again', 'replies', 'e.g. "What else can I help with?"'),
    ls('productsIntro', 'Before the product buttons', 'replies'),
    lt('careersReply', 'Careers reply', 'replies', '"{email}" becomes the careers email (bold).'),
    lt('handoff', 'Before the contact options', 'replies'),
    lt('fallback', 'Reply to a typed message the bot does not understand', 'replies'),

    lt('thanksDemo', 'Demo request sent', 'closing', '{name} and {product} are filled in.'),
    lt('thanksPartner', 'Partnership request sent', 'closing', '{name} is filled in.'),
    lt('sendError', 'Request could not be sent', 'closing'),
  ],
  preview: {
    prepare: () => ({title: 'Chat assistant'}),
  },
})
