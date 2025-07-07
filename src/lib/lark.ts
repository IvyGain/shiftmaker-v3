import * as lark from '@larksuiteoapi/node-sdk';

// Initialize Lark client
export const larkClient = new lark.Client({
  appId: process.env.LARK_APP_ID!,
  appSecret: process.env.LARK_APP_SECRET!,
  domain: lark.Domain.LarkSuite,
  loggerLevel: lark.LoggerLevel.info,
});

// Environment variables for Lark Base
export const LARK_BASE_CONFIG = {
  baseToken: process.env.LARK_BASE_TOKEN!,
  tables: {
    employees: process.env.LARK_EMPLOYEES_TABLE_ID!,
    skills: process.env.LARK_SKILLS_TABLE_ID!,
    adminSlots: process.env.LARK_ADMIN_SLOTS_TABLE_ID!,
    wishes: process.env.LARK_WISHES_TABLE_ID!,
    finalShifts: process.env.LARK_FINAL_SHIFTS_TABLE_ID!,
  },
};

// Helper function to get table records
export async function getTableRecords(tableId: string) {
  try {
    const response = await larkClient.bitable.appTable.record.list({
      app_token: LARK_BASE_CONFIG.baseToken,
      table_id: tableId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching table records:', error);
    throw error;
  }
}

// Helper function to create a record
export async function createTableRecord(tableId: string, fields: Record<string, unknown>) {
  try {
    const response = await larkClient.bitable.appTable.record.create({
      app_token: LARK_BASE_CONFIG.baseToken,
      table_id: tableId,
      fields,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating table record:', error);
    throw error;
  }
}

// Helper function to update a record
export async function updateTableRecord(tableId: string, recordId: string, fields: Record<string, unknown>) {
  try {
    const response = await larkClient.bitable.appTable.record.update({
      app_token: LARK_BASE_CONFIG.baseToken,
      table_id: tableId,
      record_id: recordId,
      fields,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating table record:', error);
    throw error;
  }
}

// Helper function to delete a record
export async function deleteTableRecord(tableId: string, recordId: string) {
  try {
    const response = await larkClient.bitable.appTable.record.delete({
      app_token: LARK_BASE_CONFIG.baseToken,
      table_id: tableId,
      record_id: recordId,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting table record:', error);
    throw error;
  }
}