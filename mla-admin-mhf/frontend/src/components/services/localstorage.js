export const set = (key, value) => localStorage.setItem(key, value)
export const get = key => localStorage.getItem(key)
export const remove = key => localStorage.removeItem(key)
export const clear = () => localStorage.clear()
export const authKey = 'authData'

export const checkUserSession = authData => {
  if (authData.mobileNo) {
    let data = {
      token: authData.token,
      mobileNo: authData.mobileNo,
      profile: authData
    }

    return { status: true, data }
  } else {
    return { status: false, data: '' }
  }
}
