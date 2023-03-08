#!/bin/sh
add(){
    curl "http://localhost/api/add?song=$1"
    printf "\n"
}

play(){
    sleep 5
    out=`curl --silent "http://localhost/api/play?song=$1"`
    if [[ "${out}" =~ "You got it!" ]] ;then
        printf "${out}\n"
        printf "\n%s\033[0;36m%s\033[0;0m\n\n"  "Check out the radio @ " "http://localhost"
    else
        printf "\nWaiting for the song to download...\n"
        play $1
    fi
}

demo(){
    printf "\nAttempting to add \"The Plan\" By Waveshaper...\n"
    add  "The+Plan+by+Waveshaper"
    play "The+Plan+by+Waveshaper"
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
    # See correspondence table at the bottom of this answer

    *)
        echo 'Other OS' 
        ;;
    esac
}

demo