export function setUrlParameters(url: string, params: any): string {
    let urlWithParams = url;
    for (const param in params) {
        if (params.hasOwnProperty(param)) {
            urlWithParams = urlWithParams.replace(`:${param}`, params[param]);
        }
    }
    return urlWithParams;

}

