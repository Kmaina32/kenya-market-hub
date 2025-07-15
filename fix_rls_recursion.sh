# Function to replace recursive RLS policy clauses
replace_rls_policies() {
    local migration_dir="${1:-./supabase/migrations}"
    
    echo "Starting RLS Policy Recursion Fix in $migration_dir"
    
    # Find all SQL migration files
    find "$migration_dir" -type f -name "*.sql" | while read -r file; do
        echo "Processing file: $file"
        
        # Replace recursive EXISTS clauses for admin role checks
        # Escaped parentheses and handled quotes
        sed -i \
            -e "s/EXISTS(SELECT 1 FROM public\.user_roles WHERE user_id = auth\.uid() AND role = 'admin')/has_role(auth.uid(), 'admin'::user_role)/g" \
            -e "s/EXISTS (SELECT 1 FROM public\.user_roles WHERE user_id = auth\.uid() AND role = 'admin')/has_role(auth.uid(), 'admin'::user_role)/g" \
            "$file"
        
        # Additional variations to catch different formatting
        # Escaped parentheses and handled quotes
        sed -i \
            -e "s/EXISTS(SELECT 1 FROM public\.user_roles ur WHERE ur\.user_id = auth\.uid() AND ur\.role = 'admin')/has_role(auth.uid(), 'admin'::user_role)/g" \
            -e "s/EXISTS (SELECT 1 FROM public\.user_roles ur WHERE ur\.user_id = auth\.uid() AND ur\.role = 'admin')/has_role(auth.uid(), 'admin'::user_role)/g" \
            "$file"
    done
    
    echo "Completed RLS Policy Recursion Fix"
}
