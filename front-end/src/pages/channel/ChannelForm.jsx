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
import Channel from '../../models/Channel'
import getValidationMessages from '../../utils/getValidationMessages';

export default function ChannelForm() {
    const API_PATH = '/channels'

    const navigate = useNavigate()
    const params = useParams()
  
    const [state, setState] = React.useState({
      channel: {
        description: '',
        commission_fee: ''
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
      channel,
      errors,
      showWaiting,
      notif
    } = state
  
    function handleFormFieldChange(event) {
      const channelCopy = {...channel}
      channelCopy[event.target.name] = event.target.value
      setState({...state, channel: channelCopy})
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
            channel: result,
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
        await Channel.validateAsync(channel, {abortEarly: false})

        //registro já existe: chama put para atualizar
        if(params.id) await myfetch.put(`${API_PATH}/${params.id}`, channel)

        //registro não exist: chama post para criar
        else await myfetch.post(API_PATH, channel)
       
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
        
        <PageTitle title={params.id ? "Editar canal " : "Cadastrar novo canal"} />


        <form onSubmit={handleFormSubmit}>
          <TextField 
            label="Descrição" 
            variant="filled"
            fullWidth
            required
            name="description"  // Nome do campo na tabela
            value={channel.description}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.description}
            helperText={errors?.description}
          />
  
          <TextField 
            label="Taxa de operação" 
            variant="filled"
            type="number"
            fullWidth
            required
            name="commission_fee"  // Nome do campo na tabela
            value={channel.commission_fee}   // Nome do campo na tabela
            onChange={handleFormFieldChange}
            error={errors?.commission_fee}
            helperText={errors?.commission_fee}
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