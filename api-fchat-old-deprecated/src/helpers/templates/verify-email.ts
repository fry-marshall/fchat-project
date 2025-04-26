export function verifyEmailTemplate(mail: string, url: string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head></head>
    <body>
        <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
            <tbody>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
                <tr align="center">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="padding-bottom:20px;max-width:516px;min-width:220px">
                            <tbody>
                                <tr>
                                    <td width="8" style="width:8px"></td>
                                    <td>
                                        <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                                            align="center">
                                            <img src="/dist/assets/logo.png" width="74" height="24" aria-hidden="true"
                                                style="margin-bottom:16px" alt="Logo">
                                            <div
                                                style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                                                <div style="font-size:24px">Vérifier votre adresse mail</div>
                                                <table align="center" style="margin-top:8px">
                                                    <tbody>
                                                        <tr style="line-height:normal">
                                                            <td align="right" style="padding-right:8px">
                                                                <img width="20" height="20" src="/dist/assets/logo.png"
                                                                    style="width:20px;height:20px;vertical-align:sub;border-radius:50%"
                                                                    alt="Badge">
                                                            </td>
                                                            <td>
                                                                <a
                                                                    style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);font-size:14px;line-height:20px">${mail}</a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center">
                                                <b>Bonjour</b>, votre compte a été créé avec succès ! 😍 <br /><br /><br />
                                                Pour vérifier votre adresse mail et profiter pleinement de nos services,
                                                veuillez cliquer sur le lien suivant ( valable 10 minutes ): <br /><br />
                                                <a target="_blank" href="${url}"
                                                    style="display: inline-block; padding:10px 24px; background-color: #00B51D; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px;">Activer
                                                    mon compte</a>
                                            </div>
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center">
                                                Si vous n'y arrivez pas, merci de cliquer ou copier/coller le lien suivant
                                                dans la barre
                                                d'adresse de votre navigateur: <br />
                                                <a target="_blank"
                                                    href="${url}"
                                                    style="display: inline-block; padding:10px 24px; text-align: center; ">${url}</a>
                                            </div>
                                        </div>
                                        <div style="text-align:left">
                                            <div
                                                style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">
                                                <div style="direction:ltr">© 2023 Viit Inc, <a
                                                        class="m_3638319201271897461afal"
                                                        style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.54);font-size:11px;line-height:18px;padding-top:12px;text-align:center">Gordon
                                                        5 rue Tidjiane Thiam, Abidjan</a></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td width="8" style="width:8px"></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
            </tbody>
        </table>
    </body>
</html>`
}
