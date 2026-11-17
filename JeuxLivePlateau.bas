Attribute VB_Name = "JeuxLivePlateau"
Option Explicit
' (c) 2026 SAS BELM DEVELOPPEMENT. Tous droits reserves. Cree avec l'aide de Claude (Anthropic), relu par l'auteur.
' MODULE A FUSIONNER dans JeuxLive.bas (famille 2 = plateau de la communication professionnelle).
' Signal : "JEU|n|diapo" (n = etiquette ROUTE_JEU de la diapo ; 101 a 104 = questions du nuage de mots).
' Voie principale : relais Cloudflare  POST /pub?room=<cle sans tirets>&t=diapos   (corps = signal)
' Secours : ntfy.sh  POST <JL_RELAIS ou https://ntfy.sh>/<cle>
' La cle (route-xxxx) est celle affichee par la tour du plateau (onglet Liaison PowerPoint).
' Aucun changement dans les JEUX : seule l'etiquette ROUTE_JEU des diapos compte.

Private Const CF_DEFAUT As String = "https://cpro-relay.belmdeveloppement.workers.dev"
Private mDerniere As String

' Cle de liaison : etiquette JL_ROUTE du support, sinon valeur memorisee par ConfigurerCle.
Private Function ClePlateau() As String
    Dim k As String
    On Error Resume Next
    k = ActivePresentation.Tags("JL_ROUTE")
    If k = "" Then k = GetSetting("JeuxLive", "Plateau", "Cle", "")
    ClePlateau = Trim$(k)
End Function

Public Sub ConfigurerCle()
    Dim k As String
    k = InputBox("Collez la cle de liaison affichee par la tour du plateau (route-...)", "JeuxLive - plateau", ClePlateau())
    If Len(Trim$(k)) >= 8 Then SaveSetting "JeuxLive", "Plateau", "Cle", Trim$(k)
End Sub

Private Function Alnum(ByVal s As String) As String
    Dim i As Long, c As String, r As String
    For i = 1 To Len(s)
        c = Mid$(s, i, 1)
        If c Like "[A-Za-z0-9]" Then r = r & c
    Next i
    Alnum = Left$(r, 40)
End Function

Private Function Poster(ByVal url As String, ByVal corps As String, ByVal attente As Boolean) As Long
    Dim h As Object
    On Error GoTo Rate
    Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")
    h.setTimeouts 3000, 3000, 3000, 4000
    h.Open "POST", url, False
    h.setRequestHeader "Content-Type", "text/plain"
    h.send corps
    Poster = h.Status
    Exit Function
Rate:
    Poster = -1
End Function

' Envoie le signal d'une diapo etiquetee ROUTE_JEU. A appeler depuis l'evenement de changement de diapo existant.
Public Sub EnvoyerPlateau(ByVal sld As Object)
    Dim n As String, cle As String, msg As String, ok As Long
    On Error Resume Next
    n = sld.Tags("ROUTE_JEU")
    If n = "" Then Exit Sub
    cle = ClePlateau()
    If cle = "" Then Exit Sub
    msg = "JEU|" & n & "|" & sld.SlideIndex
    If msg = mDerniere Then Exit Sub
    mDerniere = msg
    ok = Poster(CF_DEFAUT & "/pub?room=" & Alnum(cle) & "&t=diapos", msg, False)
    If ok <> 200 Then
        ' secours : ntfy.sh (quota par IP : ne jamais s'y fier comme voie unique)
        ok = Poster("https://ntfy.sh/" & cle, msg, False)
        If ok <> 200 Then Beep
    End If
End Sub

' Essai : envoie TEST|0|0 par le relais puis par ntfy et affiche le resultat de chaque voie.
Public Sub TesterPlateau()
    Dim cle As String, a As Long, b As Long
    cle = ClePlateau()
    If cle = "" Then ConfigurerCle: cle = ClePlateau()
    If cle = "" Then MsgBox "Cle de liaison absente.", vbExclamation, "JeuxLive - plateau": Exit Sub
    a = Poster(CF_DEFAUT & "/pub?room=" & Alnum(cle) & "&t=diapos", "TEST|0|0", False)
    b = Poster("https://ntfy.sh/" & cle, "TEST|0|0", False)
    MsgBox "Relais Cloudflare : " & IIf(a = 200, "OK", "ECHEC (" & a & ")") & vbCrLf & "Secours ntfy : " & IIf(b = 200, "OK", "ECHEC (" & b & ")") & vbCrLf & "La tour doit afficher 'Signal de test recu'.", vbInformation, "JeuxLive - plateau"
End Sub
