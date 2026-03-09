from django.contrib import admin
from .models import Category, Product

from store.models import User
from .models import ChatMessage
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
   

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'name', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email','id')
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(User, UserModelAdmin)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug', 'created_at']
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'price', 'stock', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['title']
    prepopulated_fields = {"slug": ("title",)}

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    # These columns will show up in the list view
    list_display = ('sender_id', 'receiver_id', 'message', 'timestamp')
    # This allows you to filter by sender or date on the right sidebar
    list_filter = ('timestamp', 'sender_id')
    # Makes the chat history searchable
    search_fields = ('message', 'sender_id', 'receiver_id')