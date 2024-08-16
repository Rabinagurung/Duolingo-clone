import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as Schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: Schema });

export default db;
