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
import Tag from '../../models/Tag'
import getValidationMessages from '../../utils/getValidationMessages';

export default function TagForm() {
    const API_PATH = '/tags'

    const navigate = useNavigate()
    const params = useParams()
  
    const [state, setState] = React.useState({
      tag: {
        description: '',
        color: '',
        type: '',
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
      tag,
      errors,
      showWaiting,
      notif
    } = state
  
    function handleFormFieldChange(event) {
      const tagCopy = {...tag}
      tagCopy[event.target.name] = event.target.value
      setState({...state, tag: tagCopy})
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
            tag: result,
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
        await Tag.validateAsync(tag, {abortEarly: false})

        //registro já existe: chama put para atualizar
        if(params.id) await myfetch.put(`${API_PATH}/${params.id}`, tag)

        //registro não exist: chama post para criar
        else await myfetch.post(API_PATH, tag)
       
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
        
        <PageTitle title={params.id ? "Editar etiqueta " : "Cadastrar nova etiqueta"} />


        <form onSubmit={handleFormSubmit}>
          <TextField 
            label="Descrição" 
            variant="filled"
            fullWidth
            required
            name="description"  // Nome do campo na tabela
            value={tag.description}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.description}
            helperText={errors?.description}
          />
  
          <TextField 
            label="Cor" 
            variant="filled"
            fullWidth
            required
            name="color"  // Nome do campo na tabela
            value={tag.color}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.color}
            helperText={errors?.color}
          />
  
            <TextField 
            label="Tipo" 
            variant="filled"
            fullWidth
            required
            name="type"  // Nome do campo na tabela
            value={tag.type}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.type}
            helperText={errors?.type}
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