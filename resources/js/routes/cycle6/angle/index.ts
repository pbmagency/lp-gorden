import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
export const v1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v1.url(options),
    method: 'get',
})

v1.definition = {
    methods: ["get","head"],
    url: '/c6-angle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
v1.url = (options?: RouteQueryOptions) => {
    return v1.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
v1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v1.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
v1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: v1.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
const v1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: v1.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
v1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: v1.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c6-angle'
*/
v1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: v1.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

v1.form = v1Form

const angle = {
    v1: Object.assign(v1, v1),
}

export default angle