from graphql_jwt.shortcuts import get_user_by_token


class AuthorizationMiddleware(object):
    def resolve(self, next, root, info, **args):
        headers = info.context.headers

        if 'Authorization' in headers.keys() and len(headers['Authorization']):
            token = headers['Authorization'].split(' ')[1]
            user = get_user_by_token(token)
            info.context.user = user

        return next(root, info, **args)
