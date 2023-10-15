import { Routes } from '@angular/router';

const routeConfig: Routes = [
    { path: '', redirectTo: '/chats', pathMatch: 'full' },
    {
        path: 'chats',
        loadComponent: () => import('./chat-box').then((module) => module.ChatListComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./chat-box').then((module) => module.AnonymousChatComponent),
            },
            {
                path: 'chat-not-found',
                loadComponent: () => import('./chat-box').then((module) => module.ChatNotFoundComponent),
            },
            {
                path: ':id',
                loadComponent: () => import('./chat-box').then( (module) => module.ChatConversationComponent),
            },
        ],
    },
    { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
    {
        path: 'page-not-found',
        loadComponent: () => import('./page-not-found').then((module) => module.PageNotFoundComponent),
    },
];

export default routeConfig;
