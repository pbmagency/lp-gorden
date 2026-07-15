import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.form = Controller980bb49ee7ae63891f1d891d2fbcf1c9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
const Controller7337523198342044b0077fe0715c4957 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7337523198342044b0077fe0715c4957.url(options),
    method: 'get',
})

Controller7337523198342044b0077fe0715c4957.definition = {
    methods: ["get","head"],
    url: '/c4-sp-1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
Controller7337523198342044b0077fe0715c4957.url = (options?: RouteQueryOptions) => {
    return Controller7337523198342044b0077fe0715c4957.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
Controller7337523198342044b0077fe0715c4957.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller7337523198342044b0077fe0715c4957.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
Controller7337523198342044b0077fe0715c4957.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller7337523198342044b0077fe0715c4957.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
const Controller7337523198342044b0077fe0715c4957Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller7337523198342044b0077fe0715c4957.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
Controller7337523198342044b0077fe0715c4957Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller7337523198342044b0077fe0715c4957.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-1'
*/
Controller7337523198342044b0077fe0715c4957Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller7337523198342044b0077fe0715c4957.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller7337523198342044b0077fe0715c4957.form = Controller7337523198342044b0077fe0715c4957Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
const Controller4a0b0d88bdc2d7c679100b961a65db14 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4a0b0d88bdc2d7c679100b961a65db14.url(options),
    method: 'get',
})

Controller4a0b0d88bdc2d7c679100b961a65db14.definition = {
    methods: ["get","head"],
    url: '/c4-sp-2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
Controller4a0b0d88bdc2d7c679100b961a65db14.url = (options?: RouteQueryOptions) => {
    return Controller4a0b0d88bdc2d7c679100b961a65db14.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
Controller4a0b0d88bdc2d7c679100b961a65db14.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4a0b0d88bdc2d7c679100b961a65db14.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
Controller4a0b0d88bdc2d7c679100b961a65db14.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller4a0b0d88bdc2d7c679100b961a65db14.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
const Controller4a0b0d88bdc2d7c679100b961a65db14Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a0b0d88bdc2d7c679100b961a65db14.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
Controller4a0b0d88bdc2d7c679100b961a65db14Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a0b0d88bdc2d7c679100b961a65db14.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c4-sp-2'
*/
Controller4a0b0d88bdc2d7c679100b961a65db14Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4a0b0d88bdc2d7c679100b961a65db14.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller4a0b0d88bdc2d7c679100b961a65db14.form = Controller4a0b0d88bdc2d7c679100b961a65db14Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
const Controller59e3aec23fdf295dce50340e57424969 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller59e3aec23fdf295dce50340e57424969.url(options),
    method: 'get',
})

Controller59e3aec23fdf295dce50340e57424969.definition = {
    methods: ["get","head"],
    url: '/c5-hero',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
Controller59e3aec23fdf295dce50340e57424969.url = (options?: RouteQueryOptions) => {
    return Controller59e3aec23fdf295dce50340e57424969.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
Controller59e3aec23fdf295dce50340e57424969.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller59e3aec23fdf295dce50340e57424969.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
Controller59e3aec23fdf295dce50340e57424969.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller59e3aec23fdf295dce50340e57424969.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
const Controller59e3aec23fdf295dce50340e57424969Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller59e3aec23fdf295dce50340e57424969.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
Controller59e3aec23fdf295dce50340e57424969Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller59e3aec23fdf295dce50340e57424969.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c5-hero'
*/
Controller59e3aec23fdf295dce50340e57424969Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller59e3aec23fdf295dce50340e57424969.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller59e3aec23fdf295dce50340e57424969.form = Controller59e3aec23fdf295dce50340e57424969Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
const Controller40a01a1699aa81065f0aa8fdda0f8426 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller40a01a1699aa81065f0aa8fdda0f8426.url(options),
    method: 'get',
})

Controller40a01a1699aa81065f0aa8fdda0f8426.definition = {
    methods: ["get","head"],
    url: '/bio-ig-toefl-hack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
Controller40a01a1699aa81065f0aa8fdda0f8426.url = (options?: RouteQueryOptions) => {
    return Controller40a01a1699aa81065f0aa8fdda0f8426.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
Controller40a01a1699aa81065f0aa8fdda0f8426.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller40a01a1699aa81065f0aa8fdda0f8426.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
Controller40a01a1699aa81065f0aa8fdda0f8426.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller40a01a1699aa81065f0aa8fdda0f8426.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
const Controller40a01a1699aa81065f0aa8fdda0f8426Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller40a01a1699aa81065f0aa8fdda0f8426.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
Controller40a01a1699aa81065f0aa8fdda0f8426Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller40a01a1699aa81065f0aa8fdda0f8426.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/bio-ig-toefl-hack'
*/
Controller40a01a1699aa81065f0aa8fdda0f8426Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller40a01a1699aa81065f0aa8fdda0f8426.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller40a01a1699aa81065f0aa8fdda0f8426.form = Controller40a01a1699aa81065f0aa8fdda0f8426Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
const Controlleref596e3b2ff77794a2ffd983d4e27298 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleref596e3b2ff77794a2ffd983d4e27298.url(options),
    method: 'get',
})

Controlleref596e3b2ff77794a2ffd983d4e27298.definition = {
    methods: ["get","head"],
    url: '/toefl-hack',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
Controlleref596e3b2ff77794a2ffd983d4e27298.url = (options?: RouteQueryOptions) => {
    return Controlleref596e3b2ff77794a2ffd983d4e27298.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
Controlleref596e3b2ff77794a2ffd983d4e27298.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controlleref596e3b2ff77794a2ffd983d4e27298.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
Controlleref596e3b2ff77794a2ffd983d4e27298.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controlleref596e3b2ff77794a2ffd983d4e27298.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
const Controlleref596e3b2ff77794a2ffd983d4e27298Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleref596e3b2ff77794a2ffd983d4e27298.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
Controlleref596e3b2ff77794a2ffd983d4e27298Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleref596e3b2ff77794a2ffd983d4e27298.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/toefl-hack'
*/
Controlleref596e3b2ff77794a2ffd983d4e27298Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controlleref596e3b2ff77794a2ffd983d4e27298.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controlleref596e3b2ff77794a2ffd983d4e27298.form = Controlleref596e3b2ff77794a2ffd983d4e27298Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.url = (options?: RouteQueryOptions) => {
    return Controller42a740574ecbfbac32f8cc353fc32db9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
const Controller42a740574ecbfbac32f8cc353fc32db9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/dashboard'
*/
Controller42a740574ecbfbac32f8cc353fc32db9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller42a740574ecbfbac32f8cc353fc32db9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller42a740574ecbfbac32f8cc353fc32db9.form = Controller42a740574ecbfbac32f8cc353fc32db9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
const Controller30577f290beec2f7e645688887f0890c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller30577f290beec2f7e645688887f0890c.url(options),
    method: 'get',
})

Controller30577f290beec2f7e645688887f0890c.definition = {
    methods: ["get","head"],
    url: '/c3-problem',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
Controller30577f290beec2f7e645688887f0890c.url = (options?: RouteQueryOptions) => {
    return Controller30577f290beec2f7e645688887f0890c.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
Controller30577f290beec2f7e645688887f0890c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller30577f290beec2f7e645688887f0890c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
Controller30577f290beec2f7e645688887f0890c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller30577f290beec2f7e645688887f0890c.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
const Controller30577f290beec2f7e645688887f0890cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller30577f290beec2f7e645688887f0890c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
Controller30577f290beec2f7e645688887f0890cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller30577f290beec2f7e645688887f0890c.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
Controller30577f290beec2f7e645688887f0890cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller30577f290beec2f7e645688887f0890c.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller30577f290beec2f7e645688887f0890c.form = Controller30577f290beec2f7e645688887f0890cForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

/**
* Multiple routes resolve to \Inertia\Controller::Controller, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `Controller['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const Controller = {
    '/': Controller980bb49ee7ae63891f1d891d2fbcf1c9,
    '/c4-sp-1': Controller7337523198342044b0077fe0715c4957,
    '/c4-sp-2': Controller4a0b0d88bdc2d7c679100b961a65db14,
    '/c5-hero': Controller59e3aec23fdf295dce50340e57424969,
    '/bio-ig-toefl-hack': Controller40a01a1699aa81065f0aa8fdda0f8426,
    '/toefl-hack': Controlleref596e3b2ff77794a2ffd983d4e27298,
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/c3-problem': Controller30577f290beec2f7e645688887f0890c,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller