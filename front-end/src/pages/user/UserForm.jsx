import React from 'react'
import PageTitle from '../../components/ui/PageTitle'
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab'
import myfetch from '../../utils/myfetch';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Notification from '../../components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import User from '../../models/User'
import getValidationMessages from '../../utils/getValidationMessages';

export default function UserForm() {
    const API_PATH = '/users'

    const navigate = useNavigate()
    const params = useParams()
  
    const [state, setState] = React.useState({
      user: {
        name: '',
        email: '',
        verified_email: '', //boleano
        is_admin: '', //boleano
        phone: '',
        password: ''
      },
      errors: {},
      showWaiting: false,
      notif: {
        show: false,
        severity: 'success',
        message: ''
      }
    })
    const {
      user,
      errors,
      showWaiting,
      notif
    } = state
  
    function handleFormFieldChange(event) {
      const userCopy = {...user}
      userCopy[event.target.name] = event.target.value
      setState({...state, user: userCopy})
    }
  
    function handleFormSubmit(event) {
      event.preventDefault()    // Evita que a página seja recarregada
  
      // Envia os dados para o back-end
      sendData()
    }

    //Este useffect será executado apenas durante o carregamento inicial da página
    React.useEffect(() => {
      //se houver parâmetro id na rota, dvemos carregar um rgistro existente para edição
      if(params.id)fetchData()
    }, [])
  
    async function fetchData() {
      setState({...state, showWaiting:true, errors:{}})
      try {
        const result = await myfetch.get(`${API_PATH}/${params.id}`)
          setState({
            ...state,
            user: result,
            showWaiting: false
          })
      }
      catch(error){
        console.log(error)
        setState({
          ...state,
          showWaiting: false,
          errors: errorMessages,
          notif: {
            severity: 'error',
            show: true,
            message: 'ERRO: ' + error.message
          }
        })
      }
    }

    async function sendData() {
      setState({...state, showWaiting: true, errors: {}})
      try {
        //Chama a validação da biblioteca Joi
        await User.validateAsync(user, {abortEarly: false})

        //registro já existe: chama put para atualizar
        if(params.id) await myfetch.put(`${API_PATH}/${params.id}`, user)

        //registro não exist: chama post para criar
        else await myfetch.post(API_PATH, user)
       
        // DAR FEEDBACK POSITIVO E VOLTAR PARA A LISTAGEM
        setState({
          ...state,
          showWaiting: false,
          errors: {},
          notif: {
            show: true,
            severity: 'success',
            message: 'Novo item salvo com sucesso'
          }
        })
      }
      catch(error) {
        const { validationError, errorMessages } = getValidationMessages(error)

        console.error(error)
        // DAR FEEDBACK NEGATIVO
        setState({
          ...state,
          showWaiting: false,
          errors: errorMessages,
          notif: {
            severity: 'error',
            show: !validationError,
            message: 'ERRO: ' + error.message
          }
        })
      }
    }

    function handleNotifClose(event, reason) {
      if (reason === 'clickaway') {
        return;
      }
      //se o item for salvo com sucesso, retorna à página de listagem
      if(notif.severity === 'success') navigate(-1)


      setState({ ...state, notif: { ...notif, show: false } })
    };
  
    return (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showWaiting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Notification 
          show={notif.show} 
          severity={notif.severity}
          onClose={handleNotifClose}
        >
          {notif.message}
      </Notification>
        
        <PageTitle title={params.id ? "Editar usuário " : "Cadastrar novo usuário"} />


        <form onSubmit={handleFormSubmit}>
          <TextField 
            label="Nome" 
            variant="filled"
            fullWidth
            required
            name="name"  // Nome do campo na tabela
            value={user.name}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.name}
            helperText={errors?.name}
          />

            <TextField 
            label="E-mail" 
            variant="filled"
            fullWidth
            required
            name="email"  // Nome do campo na tabela
            value={user.email}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.email}
            helperText={errors?.email}
          />
  
            <TextField 
            label="E-mail Verificado" 
            variant="filled"
            fullWidth
            required
            name="verified_email"  // Nome do campo na tabela
            value={user.verified_email}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.verified_email}
            helperText={errors?.verified_email}
          />

            <TextField 
            label="Administrador" 
            variant="filled"
            fullWidth
            required
            name="is_admin"  // Nome do campo na tabela
            value={user.is_admin}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.is_admin}
            helperText={errors?.is_admin}
          />
          <TextField 
            label="Telefone" 
            variant="filled"
            type="number"
            fullWidth
            required
            name="phone"  // Nome do campo na tabela
            value={user.phone}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.phone}
            helperText={errors?.phone}
          />
  
            <TextField 
            label="Senha" 
            variant="filled"
            fullWidth
            required
            name="password"  // Nome do campo na tabela
            value={user.password}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.password}
            helperText={errors?.password}
          />

          <Fab 
            variant="extended" 
            color="secondary"
            type="submit"
          >
            <SendIcon sx={{ mr: 1 }} />
            Enviar
          </Fab>
  
        </form>
      </>
    )
  }