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
 * @route '/c1-lp'
 */
const Controller61d3222eb21da37214d76ec9302186e3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller61d3222eb21da37214d76ec9302186e3.url(options),
    method: 'get',
})

Controller61d3222eb21da37214d76ec9302186e3.definition = {
    methods: ["get","head"],
    url: '/c1-lp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
Controller61d3222eb21da37214d76ec9302186e3.url = (options?: RouteQueryOptions) => {
    return Controller61d3222eb21da37214d76ec9302186e3.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
Controller61d3222eb21da37214d76ec9302186e3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller61d3222eb21da37214d76ec9302186e3.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
Controller61d3222eb21da37214d76ec9302186e3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller61d3222eb21da37214d76ec9302186e3.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
    const Controller61d3222eb21da37214d76ec9302186e3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller61d3222eb21da37214d76ec9302186e3.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
        Controller61d3222eb21da37214d76ec9302186e3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller61d3222eb21da37214d76ec9302186e3.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-lp'
 */
        Controller61d3222eb21da37214d76ec9302186e3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller61d3222eb21da37214d76ec9302186e3.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller61d3222eb21da37214d76ec9302186e3.form = Controller61d3222eb21da37214d76ec9302186e3Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
const Controller682f813dec72871aba0ef4952597f399 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller682f813dec72871aba0ef4952597f399.url(options),
    method: 'get',
})

Controller682f813dec72871aba0ef4952597f399.definition = {
    methods: ["get","head"],
    url: '/c2-lp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
Controller682f813dec72871aba0ef4952597f399.url = (options?: RouteQueryOptions) => {
    return Controller682f813dec72871aba0ef4952597f399.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
Controller682f813dec72871aba0ef4952597f399.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller682f813dec72871aba0ef4952597f399.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
Controller682f813dec72871aba0ef4952597f399.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller682f813dec72871aba0ef4952597f399.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
    const Controller682f813dec72871aba0ef4952597f399Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controller682f813dec72871aba0ef4952597f399.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
        Controller682f813dec72871aba0ef4952597f399Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller682f813dec72871aba0ef4952597f399.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c2-lp'
 */
        Controller682f813dec72871aba0ef4952597f399Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controller682f813dec72871aba0ef4952597f399.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controller682f813dec72871aba0ef4952597f399.form = Controller682f813dec72871aba0ef4952597f399Form
    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
const Controllerc0f57e53a36bcb75c46e44f02f30773f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc0f57e53a36bcb75c46e44f02f30773f.url(options),
    method: 'get',
})

Controllerc0f57e53a36bcb75c46e44f02f30773f.definition = {
    methods: ["get","head"],
    url: '/c3-lp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
Controllerc0f57e53a36bcb75c46e44f02f30773f.url = (options?: RouteQueryOptions) => {
    return Controllerc0f57e53a36bcb75c46e44f02f30773f.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
Controllerc0f57e53a36bcb75c46e44f02f30773f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllerc0f57e53a36bcb75c46e44f02f30773f.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
Controllerc0f57e53a36bcb75c46e44f02f30773f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllerc0f57e53a36bcb75c46e44f02f30773f.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
    const Controllerc0f57e53a36bcb75c46e44f02f30773fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: Controllerc0f57e53a36bcb75c46e44f02f30773f.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
        Controllerc0f57e53a36bcb75c46e44f02f30773fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerc0f57e53a36bcb75c46e44f02f30773f.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c3-lp'
 */
        Controllerc0f57e53a36bcb75c46e44f02f30773fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: Controllerc0f57e53a36bcb75c46e44f02f30773f.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    Controllerc0f57e53a36bcb75c46e44f02f30773f.form = Controllerc0f57e53a36bcb75c46e44f02f30773fForm
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
    '/c1-lp': Controller61d3222eb21da37214d76ec9302186e3,
    '/c2-lp': Controller682f813dec72871aba0ef4952597f399,
    '/c3-lp': Controllerc0f57e53a36bcb75c46e44f02f30773f,
    '/dashboard': Controller42a740574ecbfbac32f8cc353fc32db9,
    '/c3-problem': Controller30577f290beec2f7e645688887f0890c,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller