import axios from "axios";

interface MailMessage {
  toName: string;
  to: string;
  from: string;
  fromName: string;
  subject: string;
  body: string;
}

function getToken(): string {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("reachinbox-auth");
    return raw ? JSON.parse(raw) : "";
  }
  return "";
}


export const getMailList = ()=> {
  const token = getToken();
  return (axios.get('https://hiring.reachinbox.xyz/api/v1/onebox/list',{
      headers: {
          'authorization': `Bearer ${token}`
      }
  }).then ((res) => res.data.data)
  .catch(err => console.log(err)))
};
  

export const getMailMessages = (id: number) => {
  const token = getToken();
  return axios
    .get(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.data)
    .catch((err) => {
      console.error("Error fetching mail messages:", err);
      throw err;
    });
};

  

export const postMailMessages = (id: number, messages: MailMessage) => {
  const token = getToken();
  return axios
    .post(`https://hiring.reachinbox.xyz/api/v1/onebox/reply/${id}`, messages, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error posting messages:", err);
      throw err;
    });
};

export const deleteMailResponse = (id: number) => {
  const token = getToken();
  return axios
    .delete(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error deleting mail:", err);
      throw err;
    });
};

export const resetMail = (providedToken: string | null) => {
  return axios
    .get("https://hiring.reachinbox.xyz/api/v1/onebox/reset", {
      headers: {
        authorization: `Bearer ${providedToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error("Error resetting mail:", err);
      throw err;
    });
};
