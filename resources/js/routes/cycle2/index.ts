import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
export const agitation2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation2.url(options),
    method: 'get',
})

agitation2.definition = {
    methods: ["get","head"],
    url: '/c1-test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
agitation2.url = (options?: RouteQueryOptions) => {
    return agitation2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
agitation2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation2.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
agitation2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agitation2.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
    const agitation2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: agitation2.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
 */
        agitation2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: agitation2.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c1-test'
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
const cycle2 = {
    agitation2: Object.assign(agitation2, agitation2),
}

export default cycle2