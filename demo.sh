#!/bin/sh
add(){
    out=`curl --silent --get --data-urlencode "song=${1}" "http://localhost/api/add"`
    printf "${out}\n"
    if [[ "${out}" =~ "we couldn't find that song on genius.com" ]] ;then
        exit 1
    fi
    printf "\n"
}

play(){
    sleep 5
    out=`curl --silent --get --data-urlencode "song=${1}" "http://localhost/api/play"`
    if [[ "${out}" =~ "You got it!" ]] ;then
        printf "${out}\n"
        printf "\n%s\033[0;36m%s\033[0;0m\n\n"  "Check out the radio @ " "http://localhost"
    else
        demo "${1}"
    fi
}

demo(){
    songToPlay="${1}"
    printf "\nAttempting to add \"${songToPlay}\"...\n"
    add  "$songToPlay"
    play "$songToPlay"
}

# Could be used to automatically open a default broswer using the default open command
check_system(){
    case "$(uname -sr)" in
    Darwin*)
        echo 'Mac OS X'
        ;;

    Linux*Microsoft*)
        echo 'WSL'  # Windows Subsystem for Linux
        ;;

    Linux*)
        echo 'Linux'
        ;;

    CYGWIN*|MINGW*|MINGW32*|MSYS*)
        echo 'MS Windows'
        ;;

    # Add here more strings to compare

    *)
        echo 'Other OS' 
        ;;
    esac
}

demo "${1}"