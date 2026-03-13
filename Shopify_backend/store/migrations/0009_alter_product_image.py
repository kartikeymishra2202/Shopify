from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("store", "0008_alter_cart_id_alter_cartitem_id_alter_category_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
    ]

