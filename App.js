import { StatusBar } from "expo-status-bar";
import { useState, useCallback, useEffect } from "react";
import FontAwesome5icon from "react-native-vector-icons/FontAwesome5";
import Fontistoicon from "react-native-vector-icons/Fontisto";

import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import Task from "./components/Task";
import {
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  get,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase-config";

export default function App() {
  const [task, setTask] = useState();
  const [active, setActive] = useState({ current: "active" });
  const [todo, setTodo] = useState({});
  const [completetask, setCompletetask] = useState({});
  const [addtask, setAddtask] = useState(false);

  // adding the task to the todolist
  const handleAddTask = async () => {
    try {
      setAddtask(false);
      Keyboard.dismiss();
      const temptask = { task: task, active: true };
      const temptodo = { ...todo };

      setTask(null);
      var id = Object.keys(todo).length;
      const docRef = await setDoc(doc(db, "todos", id.toString()), temptask);

      temptodo[id] = { task: task, active: true };
      setTodo(temptodo);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // updating the completed task in the todolist
  const completeTask = async (id) => {
    try {
      const temptodo = { ...todo };
      const tempcompletedtodo = { ...completetask };
      const tempcompletedtask = { task: temptodo[id].task, active: false };
      await deleteDoc(doc(db, "todos", id));
      const tempid = Object.keys(completetask).length;

      const docRef = await setDoc(
        doc(db, "completedtodos", tempid.toString()),
        tempcompletedtask
      );

      tempcompletedtodo[tempid] = tempcompletedtask;
      setCompletetask(tempcompletedtodo);
      delete temptodo[id];
      setTodo(temptodo);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // delete the completed task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "completedtodos", id));
      const tempcompletedtodo = { ...completetask };
      delete tempcompletedtodo[id];
      setCompletetask(tempcompletedtodo);
    } catch (error) {
      console.error("Error deleting document: ", e);
    }
  };
  async function fetchdata() {
    try {
      const temptodo = {};
      const completedtodo = {};
      const querySnapshot = await getDocs(collection(db, "todos"));
      querySnapshot.forEach((doc) => {
        temptodo[doc.id] = doc.data();
      });
      const completedtodosSnapshot = await getDocs(
        collection(db, "completedtodos")
      );
      completedtodosSnapshot.forEach((doc) => {
        completedtodo[doc.id] = doc.data();
      });
      setCompletetask(completedtodo);
      setTodo(temptodo);
    } catch (error) {
      console.log("Error fetching document: ", e);
    }
  }
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>

        <ScrollView style={styles.items}>
          {active.currentstate == "alltasks" &&
            Object.keys(todo).map((t, i) => {
              return (
                <TouchableOpacity key={t} onPress={() => completeTask(t)}>
                  <Task text={todo[t].task} active={todo[t].active} />
                </TouchableOpacity>
              );
            })}
          {active.currentstate == "alltasks" &&
            Object.keys(completetask).map((t, i) => {
              return (
                <TouchableOpacity key={t} onPress={() => deleteTask(t)}>
                  <Task
                    text={completetask[t].task}
                    active={completetask[t].active}
                  />
                </TouchableOpacity>
              );
            })}
          {active.currentstate == "active" &&
            Object.keys(todo).map((t, i) => {
              return (
                <TouchableOpacity key={t} onPress={() => completeTask(t)}>
                  <Task text={todo[t].task} active={todo[t].active} />
                </TouchableOpacity>
              );
            })}
          {active.currentstate == "completed" &&
            Object.keys(completetask).map((t, i) => {
              return (
                <TouchableOpacity key={t} onPress={() => deleteTask(t)}>
                  <Task
                    text={completetask[t].task}
                    active={completetask[t].active}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TouchableOpacity onPress={() => setAddtask(true)}>
          <View sytle={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.selection}>
          <TouchableOpacity
            onPress={() => setActive({ currentstate: "alltasks" })}
          >
            <FontAwesome5icon
              name="tasks"
              size={30}
              color={active.currentstate == "alltasks" ? "#000" : "#afaaaa"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActive({ currentstate: "active" })}
          >
            <Fontistoicon
              name="checkbox-passive"
              size={25}
              color={active.currentstate == "active" ? "#000" : "#afaaaa"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive({ currentstate: "completed" })}
          >
            <Fontistoicon
              name="checkbox-active"
              size={25}
              color={active.currentstate == "completed" ? "#000" : "#afaaaa"}
            />
          </TouchableOpacity>
        </View>

        <Modal transparent={true} visible={addtask}>
          <View style={styles.modal}>
            <View style={styles.modalbox}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.modaltitle}>Add a New Task</Text>
                <TouchableOpacity onPress={() => setAddtask(false)}>
                  <View sytle={styles.addWrapper}>
                    <Text style={styles.backbutton}>x</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="write a new task here"
                value={task}
                onChangeText={(text) => setTask(text)}
              />
              <View style={{ alignItems: "center" }}>
                <TouchableOpacity onPress={handleAddTask}>
                  <View sytle={styles.addWrapper}>
                    <Text style={styles.savebutton}>Save</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  taskWrapper: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  selection: {
    position: "absolute",
    bottom: "-25%",
    left: "0%",
    height: "100%",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
  },
  active: {
    fontSize: 20,

    backgroundColor: "#b6f9c6",
    borderRadius: 5,
    height: "70%",
    width: "150%",
    textAlignVertical: "center",
    textAlign: "center",
  },
  selectionText: {
    fontSize: 20,
    color: "#afaaaa",
    width: "150%",
    textAlignVertical: "center",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 10,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    height: "25%",
    marginTop: 20,
  },

  completed: {
    fontSize: 20,
    backgroundColor: "#fca5a5",
    borderRadius: 5,
    width: "150%",
    height: "70%",
    textAlignVertical: "center",
    textAlign: "center",
  },
  addText: {
    position: "relative",
    bottom: "100%",
    left: "250%",
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    textAlign: "center",
    paddingVertical: 7,
    fontSize: 30,
    fontWeight: "light",
  },
  modal: {
    backgroundColor: "#00000030",
    flex: 1,
    justifyContent: "center",
  },
  modalbox: {
    backgroundColor: "#ffffff",
    margin: 50,
    padding: 40,
    borderRadius: 10,
  },
  modaltitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  backbutton: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    textAlign: "center",
    paddingVertical: -10,

    fontSize: 28,
    fontWeight: "medium",
  },
  savebutton: {
    width: 100,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c0c0c0",
    textAlign: "center",
    paddingVertical: 2,
    marginTop: 20,
    fontSize: 23,
  },
});
