#!/bin/sh
if [ $(git status -s | wc -c) -gt 0 ];
then
    echo "\nERR: The git repository state changed after the build, this should not happen.\n"
    git status
    exit 1
fi
