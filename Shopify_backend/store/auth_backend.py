# Shopify_backend/auth_backends.py
from django.contrib.auth import get_user_model

User = get_user_model()

class Auth0Backend:
    def authenticate(self, request, token_data=None):
        if not token_data:
            return None

        auth0_id = token_data.get('sub')
        email = token_data.get('email')

        # 1. Try to find user by Auth0 ID
        user, created = User.objects.get_or_create(
            auth0_subject=auth0_id,
            defaults={'email': email, 'username': email}
        )
        
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None