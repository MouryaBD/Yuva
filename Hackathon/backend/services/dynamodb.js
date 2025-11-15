import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMODB_ENDPOINT && { endpoint: process.env.DYNAMODB_ENDPOINT })
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names
export const TABLES = {
  USERS: 'SparkPath-Users',
  ASSESSMENTS: 'SparkPath-Assessments',
  COURSES: 'SparkPath-Courses',
  USER_PROGRESS: 'SparkPath-UserProgress',
  MENTORS: 'SparkPath-Mentors',
  SUCCESS_STORIES: 'SparkPath-SuccessStories',
  CHAT_HISTORY: 'SparkPath-ChatHistory',
  CERTIFICATIONS: 'SparkPath-Certifications',
  PATHWAYS: 'SparkPath-Pathways'
};

// Helper functions
export const putItem = async (tableName, item) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item
  });
  return await docClient.send(command);
};

export const getItem = async (tableName, key) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: key
  });
  const response = await docClient.send(command);
  return response.Item;
};

export const updateItem = async (tableName, key, updateExpression, expressionAttributeValues, expressionAttributeNames = {}) => {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(Object.keys(expressionAttributeNames).length > 0 && { ExpressionAttributeNames: expressionAttributeNames }),
    ReturnValues: 'ALL_NEW'
  });
  const response = await docClient.send(command);
  return response.Attributes;
};

export const deleteItem = async (tableName, key) => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key
  });
  return await docClient.send(command);
};

export const queryItems = async (tableName, keyConditionExpression, expressionAttributeValues, indexName = null, expressionAttributeNames = {}) => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(indexName && { IndexName: indexName }),
    ...(Object.keys(expressionAttributeNames).length > 0 && { ExpressionAttributeNames: expressionAttributeNames })
  });
  const response = await docClient.send(command);
  return response.Items;
};

export const scanItems = async (tableName, filterExpression = null, expressionAttributeValues = {}, expressionAttributeNames = {}) => {
  const command = new ScanCommand({
    TableName: tableName,
    ...(filterExpression && { FilterExpression: filterExpression }),
    ...(Object.keys(expressionAttributeValues).length > 0 && { ExpressionAttributeValues: expressionAttributeValues }),
    ...(Object.keys(expressionAttributeNames).length > 0 && { ExpressionAttributeNames: expressionAttributeNames })
  });
  const response = await docClient.send(command);
  return response.Items;
};

export default docClient;
