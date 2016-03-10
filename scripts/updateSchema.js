#!/usr/bin/env babel-node --optional es7.asyncFunctions
/* eslint no-console: 0 */

/* NOTE If this hangs and dies it's because the schema.js file
 * is grabbing a db connection which causes the process to
 * hang, commit it out and you can then update the schema.
 * Trying to use rewire to fix it, but no luck
 */
import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

import { Schema } from '../data/schema';
// import knex from '../data/dbConnection';

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  const result = await (graphql(Schema, introspectionQuery));
  // knex.destroy();
  if (result.errors) {
    console.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
})();

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../data/schema.graphql'),
  printSchema(Schema)
);
