function create_button(
    text,
    onclick,
    title_attr,
    type_attr,
    classes,
    style,
    other_attrs
) {
    let button = document.createElement('button');
    button.innerText = text;
    button.onclick = onclick;
    
    button.setAttribute('title', title_attr ?? '');
    button.setAttribute('type',type_attr ?? 'button');
    if (Array.isArray(classes)) {
        classes = classes.toString();
    } 
    button.setAttribute('class',classes ?? 'sr_button_primary sr_button');
    button.style = style;

    return button;
}