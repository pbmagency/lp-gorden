import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
export const agitation1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation1.url(options),
    method: 'get',
})

agitation1.definition = {
    methods: ["get","head"],
    url: '/cycle2/agitation-test-1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
agitation1.url = (options?: RouteQueryOptions) => {
    return agitation1.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
agitation1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation1.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
agitation1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agitation1.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
    const agitation1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agitation1.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
        agitation1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation1.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-1'
 */
        agitation1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation1.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agitation1.form = agitation1Form
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
export const agitation2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation2.url(options),
    method: 'get',
})

agitation2.definition = {
    methods: ["get","head"],
    url: '/cycle2/agitation-test-2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
agitation2.url = (options?: RouteQueryOptions) => {
    return agitation2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
agitation2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation2.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
agitation2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agitation2.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
    const agitation2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agitation2.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
        agitation2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation2.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-2'
 */
        agitation2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agitation2.form = agitation2Form
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
export const agitation3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation3.url(options),
    method: 'get',
})

agitation3.definition = {
    methods: ["get","head"],
    url: '/cycle2/agitation-test-3',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
agitation3.url = (options?: RouteQueryOptions) => {
    return agitation3.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
agitation3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation3.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
agitation3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agitation3.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
    const agitation3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agitation3.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
        agitation3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation3.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/cycle2/agitation-test-3'
 */
        agitation3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation3.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    agitation3.form = agitation3Form
const cycle2 = {
    agitation1: Object.assign(agitation1, agitation1),
agitation2: Object.assign(agitation2, agitation2),
agitation3: Object.assign(agitation3, agitation3),
}

export default cycle2