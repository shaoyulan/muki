import AxiosHttpClient from '@/utils/lib/data-fetching/axiosHttpClient'
import config from '@/config'

const baseService = new AxiosHttpClient({
  baseUrl: config.apiURL,
})

export default baseService
