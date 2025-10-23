from supabase_client import supabase

# Replace with your superuser email and password
email = "aaqib@evp.com"
password = "AaqibEVP"

# Create the user
response = supabase.auth.sign_up({
    "email": email,
    "password": password
})

if response.user:
    print("✅ Superuser created successfully!")
    print("User ID:", response.user.id)
else:
    print("❌ Failed to create user:", response)
