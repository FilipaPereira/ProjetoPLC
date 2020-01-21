import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex);

export default () => {
    return new Vuex.Store({
        state: {
            messages: [],
            myself: {},
            participants: [],
            chatTitle: '',
            placeholder: ''
        },
        mutations: {
            newMessage: (state, message) => {
                message.timestamp = message.timestamp.toISOString();
                message.myself = message.participantId === state.myself.id;
                state.messages = [...state.messages, message];
            },
            setParticipants: (state, participants) => {
                state.participants = participants;
            },
            setMyself: (state, myself) => {
                state.myself = myself;
            },
            setMessages: (state, messages) => {
                messages.map(message => {
                    //eslint-disable-next-line no-console
                    console.log(message) 
                    message.timestamp = moment(message.timestamp).toISOString();
                    message.myself = message.participantId !== state.myself.id;
                });
                state.messages = messages;
            },
            setChatTitle: (state, title) => {
                state.chatTitle = title;
            },
            setPlaceholder: (state, placeholder) => {
                state.placeholder = placeholder;
            }
        },
        actions: {},
        getters: {
            getParticipantById: (state) => (id) => {
                let curr_participant;
                state.participants.forEach(participant => {
                    if (participant.id === id) {
                        curr_participant = participant;
                    }
                });

                return curr_participant;
            },
            messages: (state) => {
                let messages = [];
                state.messages.forEach(message => {
                    let newMessage = {...message};
                    newMessage.timestamp = moment(newMessage.timestamp);
                    messages.push(newMessage);
                });
                return messages;
            },
            myself: (state) => {
                return state.myself;
            }
        }
    })
}
