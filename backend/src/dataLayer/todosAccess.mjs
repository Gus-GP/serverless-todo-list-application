import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs'

//following hexagonal architecture demo example

const logger = createLogger('dataLayer')

export class TodosAccess {
    constructor(
        //add tracing to the dynamodb actions
        docClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
        this.todosTable = todosTable;
        this.dynamoDbClient = DynamoDBDocument.from(docClient);
    }
    /**
    * Data logic function to allow user to retrieve todo information
    * @param userId user id
    * @returns results from interacting with the dynamo DB table
    */
    async getTodo(userId) {
        logger.info(`Getting all TODOs for user ${userId}`);

        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });

        logger.info(`Results: ${result.Items}`);

        return result.Items;
    }

    /**
    * Data logic function to allow user to create todo information
    * @param createTodoRequest request following pre baked shema
    * @returns results from interacting with the dynamo DB table
    */
    async create(createTodoRequest) {
        logger.info(`Creating a TODO with id ${createTodoRequest.todoId} ${JSON.stringify(createTodoRequest)}`);

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: createTodoRequest,
        });

        return { ...createTodoRequest }
    }
    /**
    * Data logic function to allow user to update todo information
    * @param userId user id
    * @param todoId user id
    * @param updateTodoRequest request from user following the right schema
    * @returns results from interacting with the dynamo DB table
    */
    async update(userId, todoId, updateTodoRequest = {}) {
        logger.info(`Updating ${todoId} with ${JSON.stringify(updateTodoRequest)}`)
        const { name, dueDate, done } = updateTodoRequest
        const params = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':dueDate': dueDate,
                ':done': done,
            },
            ReturnValues: 'UPDATED_NEW'
        };

        await this.dynamoDbClient.update(params);
    }

    /**
    * Data logic function to allow user to attach images to todos
    * @param userId user id
    * @param todoId todo id
    * @param image the image the user wants to attach
    * @param attachmentUrl the path to update this image
    * @returns results from interacting with the dynamo DB table
    */
    async setAttachmentUrl(userId, todoId, attachmentUrl) {
        logger.info(`set attachmentUrl for ${todoId} ${attachmentUrl}`)
        const params = {
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            ReturnValues: 'UPDATED_NEW'
        };

        await this.dynamoDbClient.update(params);
    }

    /**
    * Data logic function to allow user to delete todos
    * @param userId user id
    * @param todoId user id
    * @returns results from interacting with the dynamo DB table
    */
    async delete(userId, todoId) {
        logger.info(`Delete TODO: ${todoId} for user: ${userId}`);
        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                userId,
                todoId
            }
        });
    }
}