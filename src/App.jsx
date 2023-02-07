import { db, auth } from './firebaseConnection';
import './app.css'
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged

} from 'firebase/auth'

import {
  doc, 
  collection,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} 
  from 'firebase/firestore'
import { async } from '@firebase/util';


function App() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [deletePost, setDeletePost] = useState([])
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState()
  const [userDetail, setUserDetail] = useState('')

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = []
        

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author
          })
        })

        setPosts(listaPost)
      })

    }
    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user)
          setUser(true)
          setUserDetail( {
            uid: user.uid,
            email: user.email
          })
        } else {
          setUser(false)
          setUserDetail({})
        }
      })
    }
    
    checkLogin();
  }, [])

    async function handleAdd() {

      await addDoc(collection(db, "posts"), {
        title: title,
        author: author,
      })
      .then(() => {
        alert('Dados Registrados com Sucesso!');
        setTitle('');
        setAuthor('');
      })
      .catch((error) => {
        console.log('ERROR' + error)
      })
    }
       
    async function buscarPost() {
      const postsRef = collection(db, "posts")
      await getDocs(postsRef)
      .then((snapshot) => {
        let lista = []

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            title: doc.data().title,
            author: doc.data().author
          })
        })

        setPosts(lista)
      })


      .catch((error) => {
        console.log('ERROR')
      })
    }  

    async function editarPost() {
      const docRef = doc(db, "posts", idPost)
      await updateDoc(docRef, {
        title: title,
        author: author
      })
      .then(() => {
        console.log('POST ATUALIZADO')
        setIdPost('')
        setTitle('')
        setAuthor('')
      })
      .catch(() => {
        console.log('ERRO AO ATUALIZAR O POST')
      })
    }

    async function excluirPosts(id) {
      const docRef = doc(db, "posts", id)
      await deleteDoc(docRef)
      .then(() => {
        alert('POST EXCLUIDO COM SUCESSO')
      })
      .catch(() => {
        console.log('ERRO AO EXCLUIR POST')
      })
    }

    async function novoUsuario() {
      await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Cadastrado com sucesso')
        setEmail('')
        setPassword('')
      })
      .catch((error) => {
        if(error.code === 'auth/weak-password') {
          alert('Senha muito fraca')
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já existe')
        }
      })
    }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, password)
    .then((value) => {
      alert('Logado com sucesso')

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true)

      setEmail('')
      setPassword('')
    })
    .catch(() => {
      console.log('ERRO AO FAZER LOGIN')
    })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail('')
  }

  return(
    <div className="container-principal">
      <h1>ReactJs + Firebase</h1>

      {
        user && (
          <div>
            <strong>Seja bem-vindo(a) (Você está Logado!)</strong> <br />
            <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
            <br />
            <button onClick={fazerLogout}>Sair da conta</button>
            <br /><br />
          </div>
        )
      }

      <div className='container'>
        <h2>Usuários</h2>
        <label htmlFor="">Email:</label>
        <input
         value={email}
         type="email"
         onChange={(e) => setEmail(e.target.value)}
         placeholder={('Digie o seu email')}
         />
         <label htmlFor="">Senha:</label>
        <input
         value={password}
         type="password"
         onChange={(e) => setPassword(e.target.value)}
         placeholder={('Digie a sua senha')} 
         />
         <button onClick={novoUsuario}>Cadastrar</button>
         <button onClick={logarUsuario}>Fazer Login</button>
      </div>
      
      <hr />

      <div className="container">
        <h2>Posts</h2>
        <label htmlFor="">ID do Post:</label>
        <input
         placeholder='Digite o ID do Post'
         value={idPost}
         onChange={(e) => setIdPost(e.target.value)}
          />
        

        
        <label htmlFor="">Titulo:</label>
        <textarea
        type="text"
        placeholder="coloque um titulo"
        value={title}
        onChange={ (e) => setTitle(e.target.value)}
         />

         <label htmlFor="">Autor: </label>
         <textarea
        type="text"
        placeholder="Autor do post"
        value={author}
        onChange={ (e) => setAuthor(e.target.value)}
         />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button>
        <br />
        <button onClick={editarPost}>Atualizar Post</button>
        <ul>
          {posts.map( (posts) => {
            return(
              <li key={posts.id}>
                <strong>ID: {posts.id}</strong> <br />
                <span>Titulo: {posts.title}</span> <br /> 
                <span>Autor: {posts.author}</span> <br />
                <button onClick={() => excluirPosts(posts.id)}>Excluir</button> <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}


export default App;
