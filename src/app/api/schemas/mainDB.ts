// schemas/mainDB/mainDB.ts
import mongoose, { Schema, Document, Model, Connection } from 'mongoose';

// Define interfaces for TypeScript
interface IReference {
  organisation: string | null;
  reference: string | null;
  url: string | null;
}

interface ICellInfo {
  cellType: string | null;
  successRate: string | null;
  referenceURL: string | null;
}

interface IGrasInfo {
  found: boolean;
  reference_url: string | null;
}

interface IMainDB extends Document {
  name: string;
  hash: string;
  class: string;
  chemical_formula: string;
  chemical_formula_html: string;
  molecular_formula: string;
  molecular_formula_html: string;
  molecular_weight: string;
  optimal_conc: string;
  structure_image: string;
  cas_number: string;
  pricing_info: any[]; // You might want to define a more specific type
  safety_document_sheet: string;
  written_by: string[];
  raw_text: string;
  html_text: string;
  overview: string;
  tags: string;
  version: string;
  synonyms: string[];
  references: IReference[];
  cell_info: ICellInfo[];
  gras_info: IGrasInfo;
  date_written: Date;
  date_uploaded: Date;
}

// Create connection
const mainDBConnection: Connection = mongoose.createConnection(process.env.MAIN_DB_URI || '');

mainDBConnection.once('open', () => {
  console.log('Connected to main database - READ ONLY');
});

// Data Schema
const dataSchema: Schema = new mongoose.Schema({
  name: { type: String, index: true },
  hash: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  class: String,
  chemical_formula: String,
  chemical_formula_html: String,
  molecular_formula: String,
  molecular_formula_html: String,
  molecular_weight: String,
  optimal_conc: String,
  structure_image: String,
  cas_number: String,
  pricing_info: [{ type: Schema.Types.Mixed }], // Using Mixed for flexibility; specify if needed
  safety_document_sheet: String,
  written_by: [{ type: String }],
  raw_text: String,
  html_text: String,
  overview: String,
  tags: String,
  version: String,
  synonyms: [{ type: String }],
  references: [
    {
      organisation: { type: String, default: null },
      reference: { type: String, default: null },
      url: { type: String, default: null },
    },
  ],
  cell_info: [
    {
      cellType: { type: String, default: null },
      successRate: { type: String, default: null },
      referenceURL: { type: String, default: null },
    },
  ],
  gras_info: {
    found: { type: Boolean, required: true },
    reference_url: { type: String, required: false },
  },
  date_written: Date,
  date_uploaded: {
    type: Date,
    required: true,
  },
});

// Create model
const MainDB: Model<IMainDB> = mainDBConnection.model<IMainDB>('MainDB', dataSchema);

export default MainDB;