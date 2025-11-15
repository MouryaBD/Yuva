import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists
} from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const tables = [
  {
    TableName: 'SparkPath-Users',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-Assessments',
    KeySchema: [
      { AttributeName: 'assessmentId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'assessmentId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-Courses',
    KeySchema: [
      { AttributeName: 'courseId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'courseId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-UserProgress',
    KeySchema: [
      { AttributeName: 'progressId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'progressId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-Mentors',
    KeySchema: [
      { AttributeName: 'mentorId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'mentorId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-SuccessStories',
    KeySchema: [
      { AttributeName: 'storyId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'storyId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-ChatHistory',
    KeySchema: [
      { AttributeName: 'chatId', KeyType: 'HASH' },
      { AttributeName: 'timestamp', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'chatId', AttributeType: 'S' },
      { AttributeName: 'timestamp', AttributeType: 'N' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-Certifications',
    KeySchema: [
      { AttributeName: 'certificationId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'certificationId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  {
    TableName: 'SparkPath-Pathways',
    KeySchema: [
      { AttributeName: 'pathwayId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'pathwayId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'userId-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' }
        ],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
];

async function tableExists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    return false;
  }
}

async function createTables() {
  console.log('🔨 Creating DynamoDB tables...\n');

  for (const tableConfig of tables) {
    const tableName = tableConfig.TableName;

    try {
      // Check if table already exists
      if (await tableExists(tableName)) {
        console.log(`✓ Table ${tableName} already exists, skipping...`);
        continue;
      }

      // Create table
      console.log(`📝 Creating table: ${tableName}...`);
      await client.send(new CreateTableCommand(tableConfig));

      // Wait for table to be active
      console.log(`⏳ Waiting for ${tableName} to be ready...`);
      await waitUntilTableExists(
        { client, maxWaitTime: 120 },
        { TableName: tableName }
      );

      console.log(`✅ Table ${tableName} created successfully!\n`);
    } catch (error) {
      console.error(`❌ Error creating table ${tableName}:`, error.message);
    }
  }

  console.log('✨ All tables created successfully!');
}

createTables().catch(console.error);
