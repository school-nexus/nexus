import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up School Nexus database...')
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'database', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf8')
    
    // Split the schema by semicolons to execute individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0)
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            // Some errors are expected (like "already exists")
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key') ||
                error.message.includes('relation') && error.message.includes('already exists')) {
              console.log(`⚠️  Skipping existing: ${error.message.split('\n')[0]}`)
            } else {
              console.error(`❌ Error in statement ${i + 1}:`, error.message)
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.error(`❌ Failed to execute statement ${i + 1}:`, err)
        }
      }
    }
    
    console.log('🎉 Database setup completed!')
    console.log('📊 Verifying tables...')
    
    // Verify that tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'users', 'students', 'teachers', 'classes', 'subjects', 
        'terms', 'exams', 'student_fees', 'academic_years'
      ])
    
    if (tablesError) {
      console.error('❌ Error verifying tables:', tablesError)
    } else {
      console.log(`✅ Found ${tables?.length || 0} tables`)
      if (tables) {
        tables.forEach(table => {
          console.log(`  📋 ${table.table_name}`)
        })
      }
    }
    
    console.log('\n🔧 Database setup instructions:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to the SQL Editor')
    console.log('3. Copy and paste the content from database/schema.sql')
    console.log('4. Execute the SQL to create all tables and relationships')
    console.log('5. Verify that all tables were created successfully')
    console.log('\n✨ Your School Nexus database is ready!')
    
  } catch (error) {
    console.error('❌ Failed to setup database:', error)
    process.exit(1)
  }
}

// Create a simple SQL execution function for Supabase
async function createExecFunction() {
  const execFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql;
  `
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: execFunctionSQL })
    if (error && !error.message.includes('already exists')) {
      console.log('Creating exec_sql function...')
      // Try direct SQL execution
      const { error: directError } = await supabase.sql`${execFunctionSQL}`
      if (directError) {
        console.log('Note: Could not create exec_sql function. Manual setup required.')
      }
    }
  } catch (err) {
    console.log('Note: Using manual database setup approach.')
  }
}

if (require.main === module) {
  setupDatabase()
}