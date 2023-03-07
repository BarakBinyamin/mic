#!/bin/sh
demo(){
    printf "\nAttempting to add \"The Plan\" By Waveshaper...\n"
    curl "http://localhost/api/add?song=ThePlanByWaveshaper"
    printf "\n"
    sleep 5
    curl "http://localhost/api/play?song=The-Plan"
    printf "\n\n%s\033[0;36m%s\033[0;0m\n\n"  "Check out the radio @ " "http://localhost"
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