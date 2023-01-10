import { enablePromise, openDatabase } from "react-native-sqlite-storage";
const tableName = "todoData";
enablePromise(true);
export const getDBConnection = async () => {
  return openDatabase({ name: "todo-data.db", location: "default" });
};
export const createTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(task TEXT NOT NULL,active BOOLEAN NOT NULL)`;
  await db.executeSql(query);
};

export const getTodoItems = async (db) => {
  try {
    const result = [];
    const active = [];
    const completed = [];
    const activetasks = await db.executeSql(
      `SELECT task FROM ${tableName} WHERE active=1`
    );

    const completedtasks = await db.executeSql(
      `SELECT task FROM ${tableName} WHERE active=0`
    );
    result.push(active);
    result.push(completedtasks);
    return result;
  } catch (error) {
    console.log(error);
    throw Error("Failed to fetch data");
  }
};

export const saveTodoItems = async (db, todoItems) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, task,active) values` +
    todoItems
      .map((i, index) => `(${index}, '${i.task}','${i.active}')`)
      .join(",");

  return db.executeSql(insertQuery);
};
export const deleteTodoItem = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};
