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
 * @route '/test-hero-1'
 */
const Controllerf9e9df86dae589a32d2262907b342891 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf9e9df86dae589a32d2262907b342891.url(options),
    method: 'get',
})

Controllerf9e9df86dae589a32d2262907b342891.definition = {
    methods: ["get","head"],
    url: '/test-hero-1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
Controllerf9e9df86dae589a32d2262907b342891.url = (options?: RouteQueryOptions) => {
    return Controllerf9e9df86dae589a32d2262907b342891.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
Controllerf9e9df86dae589a32d2262907b342891.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerf9e9df86dae589a32d2262907b342891.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
Controllerf9e9df86dae589a32d2262907b342891.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerf9e9df86dae589a32d2262907b342891.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
    const Controllerf9e9df86dae589a32d2262907b342891Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerf9e9df86dae589a32d2262907b342891.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
        Controllerf9e9df86dae589a32d2262907b342891Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerf9e9df86dae589a32d2262907b342891.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-1'
 */
        Controllerf9e9df86dae589a32d2262907b342891Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerf9e9df86dae589a32d2262907b342891.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerf9e9df86dae589a32d2262907b342891.form = Controllerf9e9df86dae589a32d2262907b342891Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
const Controllerce8165a48e354931de4ba6e230a764ff = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerce8165a48e354931de4ba6e230a764ff.url(options),
    method: 'get',
})

Controllerce8165a48e354931de4ba6e230a764ff.definition = {
    methods: ["get","head"],
    url: '/test-hero-2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
Controllerce8165a48e354931de4ba6e230a764ff.url = (options?: RouteQueryOptions) => {
    return Controllerce8165a48e354931de4ba6e230a764ff.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
Controllerce8165a48e354931de4ba6e230a764ff.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerce8165a48e354931de4ba6e230a764ff.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
Controllerce8165a48e354931de4ba6e230a764ff.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerce8165a48e354931de4ba6e230a764ff.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
    const Controllerce8165a48e354931de4ba6e230a764ffForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerce8165a48e354931de4ba6e230a764ff.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
        Controllerce8165a48e354931de4ba6e230a764ffForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerce8165a48e354931de4ba6e230a764ff.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-2'
 */
        Controllerce8165a48e354931de4ba6e230a764ffForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerce8165a48e354931de4ba6e230a764ff.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerce8165a48e354931de4ba6e230a764ff.form = Controllerce8165a48e354931de4ba6e230a764ffForm
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
const Controller811644fb7e08756a1ce15ad59ce91784 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller811644fb7e08756a1ce15ad59ce91784.url(options),
    method: 'get',
})

Controller811644fb7e08756a1ce15ad59ce91784.definition = {
    methods: ["get","head"],
    url: '/test-hero-3',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
Controller811644fb7e08756a1ce15ad59ce91784.url = (options?: RouteQueryOptions) => {
    return Controller811644fb7e08756a1ce15ad59ce91784.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
Controller811644fb7e08756a1ce15ad59ce91784.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller811644fb7e08756a1ce15ad59ce91784.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
Controller811644fb7e08756a1ce15ad59ce91784.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller811644fb7e08756a1ce15ad59ce91784.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
    const Controller811644fb7e08756a1ce15ad59ce91784Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller811644fb7e08756a1ce15ad59ce91784.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
        Controller811644fb7e08756a1ce15ad59ce91784Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller811644fb7e08756a1ce15ad59ce91784.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/test-hero-3'
 */
        Controller811644fb7e08756a1ce15ad59ce91784Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller811644fb7e08756a1ce15ad59ce91784.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller811644fb7e08756a1ce15ad59ce91784.form = Controller811644fb7e08756a1ce15ad59ce91784Form
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
 * @route '/c2-problem-1'
 */
const Controller1e07876ccfc70d544e0ae39413fd0721 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1e07876ccfc70d544e0ae39413fd0721.url(options),
    method: 'get',
})

Controller1e07876ccfc70d544e0ae39413fd0721.definition = {
    methods: ["get","head"],
    url: '/c2-problem-1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
Controller1e07876ccfc70d544e0ae39413fd0721.url = (options?: RouteQueryOptions) => {
    return Controller1e07876ccfc70d544e0ae39413fd0721.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
Controller1e07876ccfc70d544e0ae39413fd0721.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller1e07876ccfc70d544e0ae39413fd0721.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
Controller1e07876ccfc70d544e0ae39413fd0721.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller1e07876ccfc70d544e0ae39413fd0721.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
    const Controller1e07876ccfc70d544e0ae39413fd0721Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller1e07876ccfc70d544e0ae39413fd0721.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
        Controller1e07876ccfc70d544e0ae39413fd0721Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller1e07876ccfc70d544e0ae39413fd0721.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-1'
 */
        Controller1e07876ccfc70d544e0ae39413fd0721Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller1e07876ccfc70d544e0ae39413fd0721.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller1e07876ccfc70d544e0ae39413fd0721.form = Controller1e07876ccfc70d544e0ae39413fd0721Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
const Controllerba142e09543ee234c2dc3051e5192123 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerba142e09543ee234c2dc3051e5192123.url(options),
    method: 'get',
})

Controllerba142e09543ee234c2dc3051e5192123.definition = {
    methods: ["get","head"],
    url: '/c2-problem-2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
Controllerba142e09543ee234c2dc3051e5192123.url = (options?: RouteQueryOptions) => {
    return Controllerba142e09543ee234c2dc3051e5192123.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
Controllerba142e09543ee234c2dc3051e5192123.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerba142e09543ee234c2dc3051e5192123.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
Controllerba142e09543ee234c2dc3051e5192123.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerba142e09543ee234c2dc3051e5192123.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
    const Controllerba142e09543ee234c2dc3051e5192123Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerba142e09543ee234c2dc3051e5192123.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
        Controllerba142e09543ee234c2dc3051e5192123Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerba142e09543ee234c2dc3051e5192123.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-2'
 */
        Controllerba142e09543ee234c2dc3051e5192123Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerba142e09543ee234c2dc3051e5192123.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerba142e09543ee234c2dc3051e5192123.form = Controllerba142e09543ee234c2dc3051e5192123Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
const Controller894630bbf34bdbd769e751758b7ea5cf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller894630bbf34bdbd769e751758b7ea5cf.url(options),
    method: 'get',
})

Controller894630bbf34bdbd769e751758b7ea5cf.definition = {
    methods: ["get","head"],
    url: '/c2-problem-3',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
Controller894630bbf34bdbd769e751758b7ea5cf.url = (options?: RouteQueryOptions) => {
    return Controller894630bbf34bdbd769e751758b7ea5cf.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
Controller894630bbf34bdbd769e751758b7ea5cf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller894630bbf34bdbd769e751758b7ea5cf.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
Controller894630bbf34bdbd769e751758b7ea5cf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller894630bbf34bdbd769e751758b7ea5cf.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
    const Controller894630bbf34bdbd769e751758b7ea5cfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller894630bbf34bdbd769e751758b7ea5cf.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
        Controller894630bbf34bdbd769e751758b7ea5cfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller894630bbf34bdbd769e751758b7ea5cf.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-problem-3'
 */
        Controller894630bbf34bdbd769e751758b7ea5cfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller894630bbf34bdbd769e751758b7ea5cf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller894630bbf34bdbd769e751758b7ea5cf.form = Controller894630bbf34bdbd769e751758b7ea5cfForm
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
    '/bio-ig-toefl-hack': Controller40a01a1699aa81065f0aa8fdda0f8426,
    '/toefl-hack': Controlleref596e3b2ff77794a2ffd983d4e27298,
    '/test-hero-1': Controllerf9e9df86dae589a32d2262907b342891,
    '/test-hero-2': Controllerce8165a48e354931de4ba6e230a764ff,
    '/test-hero-3': Controller811644fb7e08756a1ce15ad59ce91784,
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/c2-problem-1': Controller1e07876ccfc70d544e0ae39413fd0721,
    '/c2-problem-2': Controllerba142e09543ee234c2dc3051e5192123,
    '/c2-problem-3': Controller894630bbf34bdbd769e751758b7ea5cf,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller