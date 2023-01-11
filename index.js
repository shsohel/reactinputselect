import { PropTypes } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import './style.scss';


const ReactInputSelect = ( props ) => {
    const {
        options,
        isLoading,
        value,
        onChange,
        name,
        onCreation,
        isDisabled,
        onBlur,
        onFocus,
        isCreatable,
        placeholder,
        id,
        position
    } = props;
    const [isMenuOpen, setIsMenuOpen] = useState( false );
    const [inputValue, setInputValue] = useState( '' );

    const [mTop, setMTop] = useState( 0 );
    const [mLeft, setMLeft] = useState( 0 );
    const ref = useRef( null );


    const menuPositionTop = () => {

        const element = document?.getElementById( id );
        const elemRect = element?.getBoundingClientRect();
        setMTop( elemRect?.top + 32 );
        setMLeft( elemRect?.left );

        console.log( elemRect?.left );

    };

    const menuOnFocus = () => {
        setIsMenuOpen( true );
        setInputValue( value?.label ?? '' );

        const attribute = {
            action: 'focus-on', data: value, name
        };
        onFocus && onFocus( attribute );

        menuPositionTop();
        console.log( 'value on Focus' );

    };
    const menuOnBlur = () => {
        setIsMenuOpen( false );
        setInputValue( value?.label ?? '' );


        const attribute = {
            action: 'focus-out', data: value, name
        };

        onBlur && onBlur( attribute );

        menuPositionTop();
        console.log( 'value on Blur' );

    };

    const valueOnClear = () => {
        const attribute = {
            action: 'clear-value', data: null, name
        };
        onChange( null, attribute );
        setInputValue( '' );
        setIsMenuOpen( true );
        menuPositionTop();
        console.log( 'value on Clear' );
    };

    const optionOnClick = ( option ) => {
        const attribute = {
            action: 'option-select', data: option, name
        };

        onChange( option, attribute );
        // setValue( option )
        setInputValue( option?.label );
        setIsMenuOpen( false );
        console.log( 'value on Option Click' );

    };

    const inputValueOnChange = ( value ) => {
        setInputValue( value );
    };

    const createOnNewValue = ( newValue ) => {
        const newData = {
            label: newValue,
            value: newValue
        };

        const attribute = {
            action: 'create-new-value', data: newData, name
        };

        onCreation( newData, attribute );
        setIsMenuOpen( false );
        console.log( 'value on Create New' );

    };


    const filteredOptions = () => {
        let filtered = [];
        if ( inputValue?.length ) {
            filtered = options.filter(
                wh => wh.label?.toLowerCase().includes( inputValue?.toLowerCase() )

            );
        } else {
            filtered = options;
        }
        return filtered;
    };


    const isOptionAvailableAfterSearch = options?.some( op => op?.label.toLowerCase().trim() === inputValue.toLowerCase().trim() );


    const LoadingComponent = () => {
        return (

            <div className='load-icon'>
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    };


    useEffect( () => {
        const onScroll = () => menuPositionTop();
        window.removeEventListener( 'scroll', onScroll );
        window.addEventListener( 'scroll', onScroll, { passive: true } );
        return () => window.removeEventListener( 'scroll', onScroll );
    }, [] );


    return (
        <div className='m-dropdown'>
            <div
                id={id}
                ref={ref}
                className='m-dropdown-main'
            >
                {
                    isMenuOpen && (
                        <div
                            className='m-dropdown-menu'
                            onMouseDown={( e ) => e.preventDefault()}
                            style={{
                                width: ref?.current?.offsetWidth,
                                top: `${mTop - window.screenY}px`,
                                left: `${mLeft - window.screenX}px`
                            }}
                        >

                            <label
                                className='m-loading-text'
                                hidden={!isLoading}>
                                Loading...
                            </label>
                            <label
                                className='m-no-option-label'
                                hidden={filteredOptions().length || isLoading}>
                                No Options
                            </label>
                            <div
                                className='m-menu-options'
                                hidden={!options.length || isLoading}
                            >
                                {
                                    filteredOptions().map( ( option, index ) => {
                                        return (
                                            <div
                                                key={index}
                                                name={name}
                                                className={`m-single-option ${option?.label === value?.label ? 'active' : ''}`}
                                                onClick={() => { optionOnClick( option ); }}
                                            >
                                                {option.label}
                                            </div>
                                        );
                                    } )
                                }
                                {
                                    !isOptionAvailableAfterSearch && (
                                        <div
                                            hidden={!isCreatable || !inputValue.length}
                                            onClick={() => { createOnNewValue( inputValue ); }}
                                            className={` new-create-value`}
                                        >
                                            <label>
                                                Create : <b> {`"${inputValue}"`} </b>
                                            </label>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    )
                }

                <div className='m-dropdown-input'>

                    {/* input box before focus */}
                    <input
                        disabled={isDisabled}
                        className='m-value-input'
                        // bsSize='sm'
                        // onBlur={() => { menuOnBlur(); }}
                        hidden={isMenuOpen}
                        value={value?.label ?? ''}
                        onFocus={() => { menuOnFocus(); }}
                        onChange={( e ) => e.preventDefault()}

                        placeholder={placeholder}
                    />

                    {/* loadingIcon */}
                    {
                        isLoading && (
                            <div className='m-loading'>
                                <LoadingComponent />
                            </div>
                        )
                    }


                    {/* clear Icon */}
                    <span
                        hidden={!value || isLoading || isDisabled}
                        className='m-value-clear-icon'
                        disabled={isDisabled}

                        onClick={() => { valueOnClear(); }}
                    >
                        <svg

                            height="20"
                            width="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                        </svg>
                    </span>

                    {
                        isMenuOpen && (
                            <input
                                disabled={isDisabled}

                                // bsSize='sm'
                                className='m-focus-input shadow-none'
                                autoFocus={true}
                                value={inputValue}
                                onBlur={menuOnBlur}
                                onChange={( e ) => inputValueOnChange( e.target.value )}
                            />
                        )
                    }


                </div>

            </div>

        </div>

    );
};

module.exports.ReactInputSelect = ReactInputSelect;

// ** Default Props
ReactInputSelect.defaultProps = {
    position: 'right',
    isToolTrip: false,
    isCreatable: false,
    isDisabled: false,
    isLoading: false,
    id: 'select-id',
    name: 'select',
    placeholder: 'Select...'
};

// ** PropTypes
ReactInputSelect.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    options: PropTypes.array.isRequired,
    value: PropTypes.object,

    //Function
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onCreation: PropTypes.func,
    ///
    position: PropTypes.string,
    isCreatable: PropTypes.bool,
    isLoading: PropTypes.bool
};
