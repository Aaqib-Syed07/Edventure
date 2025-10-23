from supabase_client import supabase

# Replace 'users' with an actual table in your Supabase project
response = supabase.table("users").select("*").execute()

if response.data is not None:
    print("✅ Supabase connected successfully!")
    print(response.data)
else:
    print("❌ Failed to fetch data:", response.error_message)
