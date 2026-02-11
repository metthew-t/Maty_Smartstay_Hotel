
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartstay.settings')
django.setup()

from services.food_models import MenuItem

def seed_pasta():
    pasta, created = MenuItem.objects.get_or_create(
        name="Pasta",
        defaults={
            "description": "A classic Italian staple crafted from high-quality durum wheat semolina, offering a rich and satisfying texture. This versatile dish is an excellent source of sustained energy through complex carbohydrates and is naturally low in fat and sodium. Perfect for those looking for a delicious and health-conscious meal option.",
            "price": 180.00,
            "category": "LUNCH",
            "ingredients": "Durum Wheat Semolina (or other flour) – ~75–80%, Water – ~20–25%, Eggs (in some types like fresh pasta or egg noodles) – ~5–10% of weight if used",
            "calories": "~350–370 kcal",
            "protein_pct": "~12–15%",
            "carbs_pct": "~70–75%",
            "fat_pct": "~1–2%",
            "fiber_pct": "~3–4%",
            "health_benefits": "Benefits:\n- Good source of energy due to complex carbohydrates.\n- Low in fat and sodium (if not salted heavily in cooking).\n- Whole wheat pasta provides more fiber, aids digestion, and has a lower glycemic index.\n- Enriched pasta helps prevent certain nutrient deficiencies (B vitamins, iron).",
            "health_considerations": "Considerations:\n- Gluten content – not suitable for those with celiac disease or gluten intolerance.\n- High in carbohydrates – portion control is important for blood sugar management.\n- Refined pasta lacks fiber and some nutrients compared to whole grain versions.\n- Often served with high-calorie sauces which can affect overall healthfulness.",
            "is_vegetarian": True,
        }
    )
    if not created:
        pasta.ingredients = "Durum Wheat Semolina (or other flour) – ~75–80%, Water – ~20–25%, Eggs (in some types like fresh pasta or egg noodles) – ~5–10% of weight if used"
        pasta.calories = "~350–370 kcal"
        pasta.protein_pct = "~12–15%"
        pasta.carbs_pct = "~70–75%"
        pasta.fat_pct = "~1–2%"
        pasta.fiber_pct = "~3–4%"
        pasta.health_benefits = "Benefits:\n- Good source of energy due to complex carbohydrates.\n- Low in fat and sodium (if not salted heavily in cooking).\n- Whole wheat pasta provides more fiber, aids digestion, and has a lower glycemic index.\n- Enriched pasta helps prevent certain nutrient deficiencies (B vitamins, iron)."
        pasta.health_considerations = "Considerations:\n- Gluten content – not suitable for those with celiac disease or gluten intolerance.\n- High in carbohydrates – portion control is important for blood sugar management.\n- Refined pasta lacks fiber and some nutrients compared to whole grain versions.\n- Often served with high-calorie sauces which can affect overall healthfulness."
        pasta.save()
        print("Updated Pasta menu item.")
    else:
        print("Created Pasta menu item.")

if __name__ == "__main__":
    seed_pasta()
