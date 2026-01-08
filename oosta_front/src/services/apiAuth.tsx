type LoginParams = {
  email: string
  password: string
}

export async function login({ email, password }: LoginParams) {
    return { email, password }
}

export async function signup({ username, email, password }: { username: string, email: string, password: string }) {
    return { username, email, password }
}